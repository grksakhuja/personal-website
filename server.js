import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { createClient } from 'redis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createHash, randomBytes } from 'crypto';
import pg from 'pg';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for proper X-Forwarded-For handling behind load balancers
app.set('trust proxy', 1);

// Security headers via helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for Vite/React
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
    },
  },
}));

// Redis client
let redis = null;
let viewCount = 0; // Fallback for local dev

// PostgreSQL pool
let pgPool = null;

// AI clients
let openaiClient = null;
let anthropicClient = null;

// Server reference for graceful shutdown
let server = null;

async function initRedis() {
  if (process.env.REDIS_URL) {
    try {
      redis = createClient({ url: process.env.REDIS_URL });
      redis.on('error', (err) => console.error('Redis error:', err));
      await redis.connect();
      console.log('Connected to Redis');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      redis = null;
    }
  } else {
    console.log('No REDIS_URL - using in-memory counter (local dev)');
  }
}

function initPostgres() {
  if (process.env.DATABASE_URL) {
    // SSL configuration via DATABASE_SSL_MODE env var
    // Options: 'disable', 'prefer', 'require', 'verify-full'
    // Many cloud providers (Heroku, Railway) handle SSL at proxy level, so 'disable' may be appropriate
    const sslMode = process.env.DATABASE_SSL_MODE || (process.env.NODE_ENV === 'production' ? 'require' : 'disable');
    let ssl;
    switch (sslMode) {
      case 'disable':
        ssl = false;
        break;
      case 'prefer':
        ssl = { rejectUnauthorized: false };
        break;
      case 'require':
        ssl = { rejectUnauthorized: true };
        break;
      case 'verify-full':
        ssl = { rejectUnauthorized: true };
        break;
      default:
        ssl = false;
    }

    pgPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    console.log(`PostgreSQL pool initialized (SSL mode: ${sslMode})`);
  } else {
    console.log('No DATABASE_URL - database features disabled');
  }
}

function getAIProvider() {
  return process.env.AI_PROVIDER || 'openai';
}

function getOpenAIClient() {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

function getAnthropicClient() {
  if (!anthropicClient && process.env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

// Rate limiting using Redis with in-memory fallback
const rateLimits = {
  'analyze-jd': { max: 10, windowMs: 3600000, failClosed: true }, // 10 per hour
  'chat': { max: 15, windowMs: 3600000, failClosed: true }, // 15 per hour
};

// Lua script for atomic rate limiting (prevents race conditions)
const RATE_LIMIT_SCRIPT = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local current = redis.call('INCR', key)
if current == 1 then
  redis.call('EXPIRE', key, window)
end
return current
`;

// In-memory rate limit fallback (used when Redis is unavailable)
const inMemoryRateLimits = new Map();
const MAX_RATE_LIMIT_ENTRIES = 10000;
let cleanupInterval = null;

function cleanupInMemoryRateLimits() {
  const now = Date.now();
  for (const [key, data] of inMemoryRateLimits.entries()) {
    if (now - data.startTime > data.windowMs) {
      inMemoryRateLimits.delete(key);
    }
  }
  // Evict oldest entries if over limit to prevent unbounded growth
  if (inMemoryRateLimits.size > MAX_RATE_LIMIT_ENTRIES) {
    const entries = [...inMemoryRateLimits.entries()]
      .sort((a, b) => a[1].startTime - b[1].startTime);
    const toDelete = entries.slice(0, inMemoryRateLimits.size - MAX_RATE_LIMIT_ENTRIES);
    toDelete.forEach(([key]) => inMemoryRateLimits.delete(key));
  }
}

// Clean up stale entries periodically
cleanupInterval = setInterval(cleanupInMemoryRateLimits, 60000);

function checkInMemoryRateLimit(endpoint, ip) {
  const limit = rateLimits[endpoint];
  if (!limit) return true;

  const key = `${endpoint}:${ip}`;
  const now = Date.now();
  const data = inMemoryRateLimits.get(key);

  if (!data || now - data.startTime > limit.windowMs) {
    inMemoryRateLimits.set(key, { count: 1, startTime: now, windowMs: limit.windowMs });
    return true;
  }

  data.count++;
  return data.count <= limit.max;
}

async function checkRateLimit(endpoint, ip) {
  const limit = rateLimits[endpoint];
  if (!limit) return true;

  // If Redis unavailable and endpoint requires fail-closed behavior
  if (!redis) {
    if (limit.failClosed) {
      console.warn(`Rate limiting: Redis unavailable, using in-memory fallback for ${endpoint}`);
      return checkInMemoryRateLimit(endpoint, ip);
    }
    return true;
  }

  const key = `ratelimit:${endpoint}:${ip}`;

  try {
    // Use atomic Lua script to prevent race conditions
    const current = await redis.eval(RATE_LIMIT_SCRIPT, {
      keys: [key],
      arguments: [String(limit.max), String(Math.ceil(limit.windowMs / 1000))]
    });
    return current <= limit.max;
  } catch (err) {
    console.error('Rate limit check error:', err);
    // Fall back to in-memory limiting on Redis error
    if (limit.failClosed) {
      console.warn(`Rate limiting: Redis error, using in-memory fallback for ${endpoint}`);
      return checkInMemoryRateLimit(endpoint, ip);
    }
    return true;
  }
}

// Middleware
app.use(compression());
app.use(express.json({ limit: '100kb' }));

// Get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
}

// Hash IP address for storage (privacy-preserving analytics)
const IP_HASH_SALT = process.env.IP_HASH_SALT;
if (!IP_HASH_SALT && process.env.NODE_ENV === 'production') {
  console.error('FATAL: IP_HASH_SALT must be set in production');
  process.exit(1);
}
const SALT = IP_HASH_SALT || 'dev-only-salt';
function hashIP(ip) {
  return createHash('sha256').update(`${SALT}:${ip}`).digest('hex').substring(0, 16);
}

// Validate session ID format to prevent injection attacks
function isValidSessionId(sessionId) {
  // Allow: session_{timestamp}_{hex} format, max 64 chars
  return /^session_\d+_[a-f0-9]{9,24}$/.test(sessionId) && sessionId.length <= 64;
}

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/ready', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
  };

  // Check PostgreSQL
  if (pgPool) {
    try {
      await pgPool.query('SELECT 1');
      checks.database = true;
    } catch (err) {
      console.error('Health check - database error:', err.message);
    }
  } else {
    checks.database = null; // Not configured
  }

  // Check Redis
  if (redis) {
    try {
      await redis.ping();
      checks.redis = true;
    } catch (err) {
      console.error('Health check - redis error:', err.message);
    }
  } else {
    checks.redis = null; // Not configured
  }

  const allHealthy = Object.values(checks).every(v => v === true || v === null);
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    checks,
  });
});

// API: Increment and return view count
app.get('/api/views', async (req, res) => {
  try {
    let count;
    if (redis) {
      count = await redis.incr('portfolio:views');
    } else {
      viewCount++;
      count = viewCount;
    }
    res.json({ views: count });
  } catch (err) {
    console.error('View count error:', err);
    res.status(500).json({ error: 'Failed to get view count' });
  }
});

// API: Get count without incrementing
app.get('/api/views/count', async (req, res) => {
  try {
    let count;
    if (redis) {
      count = (await redis.get('portfolio:views')) || 0;
    } else {
      count = viewCount;
    }
    res.json({ views: parseInt(count, 10) });
  } catch (err) {
    console.error('View count error:', err);
    res.status(500).json({ error: 'Failed to get view count' });
  }
});

// API: Get public profile data
app.get('/api/profile', async (req, res) => {
  if (!pgPool) {
    return res.status(503).json({ error: 'Database not available' });
  }

  try {
    const [profileResult, experiencesResult, skillsResult, suggestedQuestionsResult] = await Promise.all([
      pgPool.query('SELECT * FROM candidate_profile LIMIT 1'),
      pgPool.query('SELECT * FROM experiences ORDER BY display_order ASC'),
      pgPool.query('SELECT * FROM skills ORDER BY proficiency, display_order ASC'),
      pgPool.query('SELECT question, answer FROM faq_responses WHERE is_suggested = TRUE ORDER BY display_order ASC'),
    ]);

    res.json({
      profile: profileResult.rows[0] || null,
      experiences: experiencesResult.rows,
      skills: skillsResult.rows,
      suggestedQuestions: suggestedQuestionsResult.rows,
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// API: Analyze Job Description
app.post('/api/analyze-jd', async (req, res) => {
  const clientIP = getClientIP(req);

  // Rate limit check
  const allowed = await checkRateLimit('analyze-jd', clientIP);
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  const { jobDescription } = req.body;
  if (!jobDescription || typeof jobDescription !== 'string') {
    return res.status(400).json({ error: 'Job description is required' });
  }

  if (jobDescription.length > 10000) {
    return res.status(400).json({ error: 'Job description is too long (max 10000 characters)' });
  }

  try {
    // Fetch profile context from database
    let profileContext = null;
    if (pgPool) {
      const [profileResult, skillsResult, gapsResult, instructionsResult] = await Promise.all([
        pgPool.query('SELECT * FROM candidate_profile LIMIT 1'),
        pgPool.query('SELECT * FROM skills ORDER BY proficiency, display_order ASC'),
        pgPool.query('SELECT * FROM gaps_weaknesses ORDER BY is_dealbreaker DESC, display_order ASC'),
        pgPool.query('SELECT * FROM ai_instructions WHERE is_active = TRUE AND category = $1 ORDER BY priority DESC', ['anti_sycophancy']),
      ]);

      profileContext = {
        profile: profileResult.rows[0],
        skills: skillsResult.rows,
        gaps: gapsResult.rows,
        instructions: instructionsResult.rows,
      };
    }

    // Build system prompt
    const systemPrompt = buildJDAnalysisPrompt(profileContext);
    const userMessage = `Please analyze this job description and assess my fit:\n\n---\n${jobDescription}\n---\n\nRespond with JSON only.`;

    // Call AI
    const aiResponse = await callAI(userMessage, systemPrompt, 'analysis');

    // Parse response
    let parsed;
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = aiResponse;
      const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      parsed = JSON.parse(jsonStr.trim());
    } catch (parseErr) {
      const truncatedResponse = aiResponse.length > 200 ? aiResponse.substring(0, 200) + ' [TRUNCATED]' : aiResponse;
      console.error('Failed to parse AI response:', truncatedResponse);
      return res.status(500).json({ error: 'Failed to parse analysis results' });
    }

    // Validate response structure
    if (!parsed.verdict || !['strong_fit', 'worth_conversation', 'probably_not'].includes(parsed.verdict)) {
      return res.status(500).json({ error: 'Invalid analysis response' });
    }

    // Save to database for analytics (optional)
    if (pgPool) {
      try {
        await pgPool.query(
          `INSERT INTO jd_analyses (job_description, verdict, where_i_dont_fit, what_transfers, recommendation, opening_paragraph, is_demo, session_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            jobDescription.substring(0, 5000), // Truncate for storage
            parsed.verdict,
            parsed.whereIDontFit || [],
            parsed.whatTransfers || [],
            parsed.recommendation || '',
            parsed.openingParagraph || '',
            false,
            hashIP(clientIP), // Hash IP for privacy
          ]
        );
      } catch (dbErr) {
        console.error('Failed to save analysis:', dbErr);
        // Continue - don't fail the request
      }
    }

    res.json({
      verdict: parsed.verdict,
      openingParagraph: parsed.openingParagraph || '',
      whereIDontFit: parsed.whereIDontFit || [],
      whatTransfers: parsed.whatTransfers || [],
      recommendation: parsed.recommendation || '',
    });
  } catch (err) {
    console.error('JD Analysis error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

// API: Chat
app.post('/api/chat', async (req, res) => {
  const clientIP = getClientIP(req);

  // Rate limit check
  const allowed = await checkRateLimit('chat', clientIP);
  if (!allowed) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
  }

  const { messages, sessionId } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Validate session ID format if provided
  if (sessionId && !isValidSessionId(sessionId)) {
    return res.status(400).json({ error: 'Invalid session ID format' });
  }

  // Limit message array length to prevent abuse
  if (messages.length > 50) {
    return res.status(400).json({ error: 'Too many messages (max 50)' });
  }

  // Validate messages
  for (const msg of messages) {
    if (!msg.role || !['user', 'assistant'].includes(msg.role)) {
      return res.status(400).json({ error: 'Invalid message role' });
    }
    if (!msg.content || typeof msg.content !== 'string') {
      return res.status(400).json({ error: 'Invalid message content' });
    }
    if (msg.content.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters)' });
    }
  }

  try {
    // Fetch full profile context
    let profileContext = null;
    if (pgPool) {
      const [profileResult, experiencesResult, skillsResult, gapsResult, faqsResult, instructionsResult] = await Promise.all([
        pgPool.query('SELECT * FROM candidate_profile LIMIT 1'),
        pgPool.query('SELECT * FROM experiences ORDER BY display_order ASC'),
        pgPool.query('SELECT * FROM skills ORDER BY proficiency, display_order ASC'),
        pgPool.query('SELECT * FROM gaps_weaknesses ORDER BY is_dealbreaker DESC, display_order ASC'),
        pgPool.query('SELECT * FROM faq_responses ORDER BY display_order ASC'),
        pgPool.query('SELECT * FROM ai_instructions WHERE is_active = TRUE ORDER BY priority DESC'),
      ]);

      const skills = skillsResult.rows;
      profileContext = {
        profile: profileResult.rows[0],
        experiences: experiencesResult.rows,
        skills: {
          strong: skills.filter(s => s.proficiency === 'strong'),
          moderate: skills.filter(s => s.proficiency === 'moderate'),
          gap: skills.filter(s => s.proficiency === 'gap'),
        },
        gaps: gapsResult.rows,
        faqs: faqsResult.rows,
        instructions: instructionsResult.rows,
      };
    }

    // Build system prompt
    const systemPrompt = buildChatSystemPrompt(profileContext);

    // Call AI
    const aiResponse = await callAI(messages, systemPrompt, 'chat');

    // Generate or use session ID (using cryptographically secure random bytes)
    const newSessionId = sessionId || `session_${Date.now()}_${randomBytes(12).toString('hex')}`;

    // Save to database for analytics
    if (pgPool) {
      try {
        const lastUserMessage = messages[messages.length - 1];
        await pgPool.query(
          `INSERT INTO chat_history (session_id, role, content, metadata) VALUES ($1, $2, $3, $4)`,
          [newSessionId, 'user', lastUserMessage.content, JSON.stringify({ ip: hashIP(clientIP) })]
        );
        await pgPool.query(
          `INSERT INTO chat_history (session_id, role, content, metadata) VALUES ($1, $2, $3, $4)`,
          [newSessionId, 'assistant', aiResponse, JSON.stringify({})]
        );
      } catch (dbErr) {
        console.error('Failed to save chat:', dbErr);
      }
    }

    res.json({
      response: aiResponse,
      sessionId: newSessionId,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
});

// AI Helper Functions
const AI_TIMEOUT_MS = 30000; // 30 seconds

/**
 * IMPORTANT: The buildJDAnalysisPrompt and buildChatSystemPrompt functions below
 * are duplicated in src/lib/ai/prompts.ts (which has the tests).
 * If you modify the prompt logic, update BOTH locations.
 *
 * The duplication exists because server.js runs as plain Node.js without a TypeScript
 * build step. A future improvement would be to compile prompts.ts and import it here.
 */

async function callAI(input, systemPrompt, mode) {
  const provider = getAIProvider();

  // Determine model based on mode
  const models = {
    openai: {
      chat: 'gpt-4o-mini',
      analysis: 'gpt-4o',
    },
    anthropic: {
      chat: 'claude-3-haiku-20240307',
      analysis: 'claude-sonnet-4-20250514',
    },
  };

  const model = models[provider][mode];

  // Create timeout abort controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    if (provider === 'anthropic') {
      const client = getAnthropicClient();
      if (!client) throw new Error('Anthropic API key not configured');

      const messages = Array.isArray(input)
        ? input.map(m => ({ role: m.role, content: m.content }))
        : [{ role: 'user', content: input }];

      const response = await client.messages.create({
        model,
        max_tokens: 2000,
        system: systemPrompt,
        messages,
      }, { signal: controller.signal });

      return response.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join('');
    } else {
      const client = getOpenAIClient();
      if (!client) throw new Error('OpenAI API key not configured');

      const messages = Array.isArray(input)
        ? [{ role: 'system', content: systemPrompt }, ...input.map(m => ({ role: m.role, content: m.content }))]
        : [{ role: 'system', content: systemPrompt }, { role: 'user', content: input }];

      const response = await client.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
      }, { signal: controller.signal });

      return response.choices[0]?.message?.content || '';
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('AI request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildJDAnalysisPrompt(context) {
  if (!context || !context.profile) {
    return `You are an AI analyzing job descriptions for fit. Respond with valid JSON only.`;
  }

  const { profile, skills, gaps, instructions } = context;

  const antiSycophancyRules = instructions
    .map(i => `- ${i.instruction}`)
    .join('\n');

  const strongSkills = skills.filter(s => s.proficiency === 'strong');
  const moderateSkills = skills.filter(s => s.proficiency === 'moderate');
  const gapSkills = skills.filter(s => s.proficiency === 'gap');

  return `## YOUR TASK
Analyze the provided job description and give an honest assessment of whether ${profile.name} is a good fit.

## CRITICAL ANTI-SYCOPHANCY RULES
${antiSycophancyRules}

## CANDIDATE PROFILE
Name: ${profile.name}
Title: ${profile.title}
Years Experience: ${profile.years_experience || '10+'}

## STRONG SKILLS (Can speak with authority)
${strongSkills.map(s => `- ${s.name}: ${s.context || ''}`).join('\n')}

## MODERATE SKILLS (Competent but not expert)
${moderateSkills.map(s => `- ${s.name}: ${s.context || ''}`).join('\n')}

## GAP SKILLS (Limited or no experience)
${gapSkills.map(s => `- ${s.name}: ${s.context || ''}`).join('\n')}

## EXPLICIT DEALBREAKERS
${gaps.filter(g => g.is_dealbreaker).map(g => `- ${g.area}: ${g.description}`).join('\n')}

## OTHER LIMITATIONS
${gaps.filter(g => !g.is_dealbreaker).map(g => `- ${g.area}: ${g.description}`).join('\n')}

## RESPONSE FORMAT
You must respond with valid JSON in exactly this format:

{
  "verdict": "strong_fit" | "worth_conversation" | "probably_not",
  "openingParagraph": "A direct, first-person assessment (2-3 sentences) of the fit. Be honest.",
  "whereIDontFit": ["List of specific gaps relevant to this JD", "Be specific about what's required that I lack"],
  "whatTransfers": ["List of relevant strengths and transferable skills"],
  "recommendation": "Final recommendation in first person. If it's not a fit, say so clearly. Use phrases like 'I'm probably not your person' when appropriate."
}

## VERDICT CRITERIA
- strong_fit: Core requirements are well-covered, no dealbreakers hit
- worth_conversation: Some gaps but strong adjacent skills, could work out
- probably_not: Multiple significant gaps OR dealbreakers hit

IMPORTANT: Lead with gaps when they're relevant. Don't bury concerns. If it's not a good fit, say so upfront.`;
}

function buildChatSystemPrompt(context) {
  if (!context || !context.profile) {
    return `I am an AI assistant representing a professional. I don't have access to profile information at the moment.`;
  }

  const { profile, experiences, skills, gaps, faqs, instructions } = context;

  const instructionText = instructions
    .map(i => `- ${i.instruction}`)
    .join('\n');

  const sections = [];

  // AI Instructions
  sections.push(`## BEHAVIOR INSTRUCTIONS
${instructionText}`);

  // Profile overview
  const educationLine = profile.education_summary ? `\nEducation: ${profile.education_summary}` : '';
  sections.push(`## ABOUT ME
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location || 'Not specified'}
Years of Experience: ${profile.years_experience || '10+'}
Current Status: ${profile.status === 'open' ? 'Open to opportunities' : profile.status}${educationLine}

Bio: ${profile.bio || ''}

Preferred Roles: ${profile.preferred_roles?.join(', ') || 'Platform Engineering, DevOps'}
Preferred Company Stage: ${profile.preferred_company_stages?.join(', ') || 'Growth stage'}`);

  // Experience
  if (experiences && experiences.length > 0) {
    const expText = experiences.map(exp => {
      const endDate = exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
      const startDate = new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

      let text = `### ${exp.role} at ${exp.company} (${startDate} - ${endDate})
${exp.description || ''}`;

      if (exp.situation) text += `\n\nSituation: ${exp.situation}`;
      if (exp.approach) text += `\n\nApproach: ${exp.approach}`;
      if (exp.technical_work) text += `\n\nTechnical Work: ${exp.technical_work}`;
      if (exp.lessons_learned) text += `\n\nLessons Learned: ${exp.lessons_learned}`;

      return text;
    }).join('\n\n');

    sections.push(`## WORK EXPERIENCE
${expText}`);
  }

  // Skills by proficiency
  sections.push(`## SKILLS SELF-ASSESSMENT

### STRONG (Daily use, deep expertise)
${skills.strong.map(s => `- ${s.name}: ${s.context || 'Strong expertise'}`).join('\n')}

### MODERATE (Competent, used regularly)
${skills.moderate.map(s => `- ${s.name}: ${s.context || 'Moderate experience'}`).join('\n')}

### GAPS (Limited or no experience)
${skills.gap.map(s => `- ${s.name}: ${s.context || 'Limited experience'}`).join('\n')}`);

  // Explicit gaps and weaknesses
  if (gaps && gaps.length > 0) {
    const dealbreakers = gaps.filter(g => g.is_dealbreaker);
    const otherGaps = gaps.filter(g => !g.is_dealbreaker);

    let gapText = '';

    if (dealbreakers.length > 0) {
      gapText += `### DEALBREAKERS (Roles requiring these are NOT a fit)
${dealbreakers.map(g => `- ${g.area}: ${g.description}${g.mitigation ? ` (${g.mitigation})` : ''}`).join('\n')}

`;
    }

    if (otherGaps.length > 0) {
      gapText += `### OTHER LIMITATIONS
${otherGaps.map(g => `- ${g.area}: ${g.description}${g.mitigation ? ` (${g.mitigation})` : ''}`).join('\n')}`;
    }

    sections.push(`## EXPLICIT GAPS AND WEAKNESSES
${gapText}`);
  }

  // FAQ reference
  if (faqs && faqs.length > 0) {
    const faqText = faqs.slice(0, 10).map(f =>
      `Q: ${f.question}\nA: ${f.answer}`
    ).join('\n\n');

    sections.push(`## REFERENCE ANSWERS
Use these as guidance for similar questions:

${faqText}`);
  }

  return sections.join('\n\n---\n\n');
}

// Serve static files
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Graceful shutdown handler
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  const shutdownTimeout = setTimeout(() => {
    console.error('Shutdown timeout reached, forcing exit');
    process.exit(1);
  }, 10000);

  try {
    // Stop accepting new connections
    if (server) {
      await new Promise((resolve) => {
        server.close(resolve);
        console.log('HTTP server closed');
      });
    }

    // Clear rate limit cleanup interval
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      console.log('Rate limit cleanup interval cleared');
    }

    // Close PostgreSQL pool
    if (pgPool) {
      await pgPool.end();
      console.log('PostgreSQL pool closed');
    }

    // Close Redis client
    if (redis) {
      await redis.quit();
      console.log('Redis client closed');
    }

    clearTimeout(shutdownTimeout);
    console.log('Graceful shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
}

// Start server
async function start() {
  await initRedis();
  initPostgres();
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`AI Provider: ${getAIProvider()}`);
  });

  // Register shutdown handlers
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

start();

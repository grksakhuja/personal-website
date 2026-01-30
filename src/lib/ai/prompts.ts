/**
 * AI Prompt Builders
 *
 * Constructs system prompts from database content
 * for both chat and JD analysis use cases.
 */

import type {
  CandidateProfile,
  Experience,
  GapWeakness,
  FAQResponse,
  AIInstruction,
  SkillsByProficiency
} from '../../types/database.js';

interface ProfileContext {
  profile: CandidateProfile | null;
  experiences: Experience[];
  skills: SkillsByProficiency;
  gaps: GapWeakness[];
  faqs: FAQResponse[];
  instructions: AIInstruction[];
}

/**
 * Build system prompt for chat conversations
 */
export function buildChatSystemPrompt(context: ProfileContext): string {
  const { profile, experiences, skills, gaps, faqs, instructions } = context;

  if (!profile) {
    return 'I am an AI assistant. I don\'t have access to profile information at the moment.';
  }

  const sections: string[] = [];

  // AI Instructions (sorted by priority)
  const instructionText = instructions
    .map(i => `- ${i.instruction}`)
    .join('\n');

  sections.push(`## BEHAVIOR INSTRUCTIONS
${instructionText}`);

  // Profile overview
  sections.push(`## ABOUT ME
Name: ${profile.name}
Title: ${profile.title}
Location: ${profile.location || 'Not specified'}
Years of Experience: ${profile.years_experience || '10+'}
Current Status: ${profile.status === 'open' ? 'Open to opportunities' : profile.status}

Bio: ${profile.bio || ''}

Preferred Roles: ${profile.preferred_roles?.join(', ') || 'Platform Engineering, DevOps'}
Preferred Company Stage: ${profile.preferred_company_stages?.join(', ') || 'Growth stage'}`);

  // Experience
  if (experiences.length > 0) {
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
  if (gaps.length > 0) {
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
  if (faqs.length > 0) {
    const faqText = faqs.slice(0, 10).map(f =>
      `Q: ${f.question}\nA: ${f.answer}`
    ).join('\n\n');

    sections.push(`## REFERENCE ANSWERS
Use these as guidance for similar questions:

${faqText}`);
  }

  return sections.join('\n\n---\n\n');
}

/**
 * Build system prompt for JD analysis
 */
export function buildJDAnalysisPrompt(context: ProfileContext): string {
  const { profile, skills, gaps, instructions } = context;

  if (!profile) {
    return 'Unable to analyze - profile data not available.';
  }

  // Get anti-sycophancy instructions specifically
  const antiSycophancyRules = instructions
    .filter(i => i.category === 'anti_sycophancy')
    .map(i => `- ${i.instruction}`)
    .join('\n');

  return `## YOUR TASK
Analyze the provided job description and give an honest assessment of whether ${profile.name} is a good fit.

## CRITICAL ANTI-SYCOPHANCY RULES
${antiSycophancyRules}

## CANDIDATE PROFILE
Name: ${profile.name}
Title: ${profile.title}
Years Experience: ${profile.years_experience || '10+'}

## STRONG SKILLS (Can speak with authority)
${skills.strong.map(s => `- ${s.name}: ${s.context || ''}`).join('\n')}

## MODERATE SKILLS (Competent but not expert)
${skills.moderate.map(s => `- ${s.name}: ${s.context || ''}`).join('\n')}

## GAP SKILLS (Limited or no experience)
${skills.gap.map(s => `- ${s.name}: ${s.context || ''}`).join('\n')}

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

/**
 * Get the user message format for JD analysis
 */
export function formatJDAnalysisUserMessage(jobDescription: string): string {
  return `Please analyze this job description and assess my fit:

---
${jobDescription}
---

Respond with JSON only.`;
}

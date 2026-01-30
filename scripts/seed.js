/**
 * Database Seed Data Loader
 *
 * Loads seed data from JSON files into the database.
 * Data source priority:
 * 1. SEED_DATA_BASE64 env var (base64-encoded JSON) - used in production
 * 2. seed-data/ directory (gitignored) - used for local development with real data
 * 3. seed-data.example/ directory - fallback for demo mode
 *
 * Safe to run multiple times - uses TRUNCATE + INSERT pattern.
 */

import pg from 'pg';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

/**
 * Load seed data from available sources
 * @returns {Object|null} Parsed seed data or null if unavailable
 */
function loadSeedData() {
  // Priority 1: SEED_DATA_BASE64 env var (production)
  if (process.env.SEED_DATA_BASE64) {
    console.log('Loading seed data from SEED_DATA_BASE64 environment variable');
    try {
      const decoded = Buffer.from(process.env.SEED_DATA_BASE64, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch (err) {
      console.error('Failed to parse SEED_DATA_BASE64:', err.message);
      throw err;
    }
  }

  // Priority 2: seed-data/ directory (local dev with real data)
  const seedDataDir = join(projectRoot, 'seed-data');
  if (existsSync(seedDataDir)) {
    console.log('Loading seed data from seed-data/ directory');
    return loadFromDirectory(seedDataDir);
  }

  // Priority 3: seed-data.example/ directory (demo mode)
  const exampleDir = join(projectRoot, 'seed-data.example');
  if (existsSync(exampleDir)) {
    console.log('Loading seed data from seed-data.example/ directory (demo mode)');
    return loadFromDirectory(exampleDir);
  }

  console.log('No seed data found - skipping seeding');
  return null;
}

/**
 * Load all JSON files from a directory
 * @param {string} dir Directory path
 * @returns {Object} Combined seed data object
 */
function loadFromDirectory(dir) {
  const files = [
    'profile.json',
    'experiences.json',
    'skills.json',
    'gaps.json',
    'faq.json',
    'ai_instructions.json',
    'demo_jds.json'
  ];

  const data = {};
  for (const file of files) {
    const filePath = join(dir, file);
    if (existsSync(filePath)) {
      const key = file.replace('.json', '');
      data[key] = JSON.parse(readFileSync(filePath, 'utf8'));
      console.log(`  Loaded ${file}`);
    } else {
      console.log(`  Skipping ${file} (not found)`);
    }
  }

  return data;
}

/**
 * Seed the database with the provided data
 * @param {pg.Client} client Database client
 * @param {Object} data Seed data object
 */
async function seedDatabase(client, data) {
  // Use a transaction for atomicity
  await client.query('BEGIN');

  try {
    // 1. Seed profile
    if (data.profile) {
      console.log('Seeding candidate_profile...');
      await client.query('TRUNCATE candidate_profile RESTART IDENTITY CASCADE');

      // Check if education_summary column exists (from migration 009)
      const { rows: columns } = await client.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'candidate_profile' AND column_name = 'education_summary'
      `);
      const hasEducationSummary = columns.length > 0;

      if (hasEducationSummary && data.profile.education_summary) {
        await client.query(`
          INSERT INTO candidate_profile (
            name, title, taglines, bio, location, status,
            preferred_roles, preferred_company_stages, years_experience, education_summary
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          data.profile.name,
          data.profile.title,
          data.profile.taglines,
          data.profile.bio,
          data.profile.location,
          data.profile.status,
          data.profile.preferred_roles,
          data.profile.preferred_company_stages,
          data.profile.years_experience,
          data.profile.education_summary
        ]);
      } else {
        await client.query(`
          INSERT INTO candidate_profile (
            name, title, taglines, bio, location, status,
            preferred_roles, preferred_company_stages, years_experience
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          data.profile.name,
          data.profile.title,
          data.profile.taglines,
          data.profile.bio,
          data.profile.location,
          data.profile.status,
          data.profile.preferred_roles,
          data.profile.preferred_company_stages,
          data.profile.years_experience
        ]);
      }
      console.log('  ✓ candidate_profile seeded');
    }

    // 2. Seed experiences
    if (data.experiences && data.experiences.length > 0) {
      console.log('Seeding experiences...');
      await client.query('TRUNCATE experiences RESTART IDENTITY CASCADE');

      for (const exp of data.experiences) {
        await client.query(`
          INSERT INTO experiences (
            company, role, start_date, end_date, location, description,
            situation, approach, technical_work, lessons_learned, highlights, display_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        `, [
          exp.company,
          exp.role,
          exp.start_date,
          exp.end_date,
          exp.location,
          exp.description,
          exp.situation,
          exp.approach,
          exp.technical_work,
          exp.lessons_learned,
          exp.highlights,
          exp.display_order
        ]);
      }
      console.log(`  ✓ ${data.experiences.length} experiences seeded`);
    }

    // 3. Seed skills
    if (data.skills && data.skills.length > 0) {
      console.log('Seeding skills...');
      await client.query('TRUNCATE skills RESTART IDENTITY CASCADE');

      for (const skill of data.skills) {
        await client.query(`
          INSERT INTO skills (
            name, category, icon, proficiency, years_used, context, display_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          skill.name,
          skill.category,
          skill.icon,
          skill.proficiency,
          skill.years_used,
          skill.context,
          skill.display_order
        ]);
      }
      console.log(`  ✓ ${data.skills.length} skills seeded`);
    }

    // 4. Seed gaps/weaknesses
    if (data.gaps && data.gaps.length > 0) {
      console.log('Seeding gaps_weaknesses...');
      await client.query('TRUNCATE gaps_weaknesses RESTART IDENTITY CASCADE');

      for (const gap of data.gaps) {
        await client.query(`
          INSERT INTO gaps_weaknesses (
            area, description, is_dealbreaker, mitigation, display_order
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          gap.area,
          gap.description,
          gap.is_dealbreaker,
          gap.mitigation,
          gap.display_order
        ]);
      }
      console.log(`  ✓ ${data.gaps.length} gaps seeded`);
    }

    // 5. Seed FAQ responses
    if (data.faq && data.faq.length > 0) {
      console.log('Seeding faq_responses...');
      await client.query('TRUNCATE faq_responses RESTART IDENTITY CASCADE');

      for (const faq of data.faq) {
        await client.query(`
          INSERT INTO faq_responses (
            question, answer, category, is_suggested, display_order
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          faq.question,
          faq.answer,
          faq.category,
          faq.is_suggested,
          faq.display_order
        ]);
      }
      console.log(`  ✓ ${data.faq.length} FAQ responses seeded`);
    }

    // 6. Seed AI instructions
    if (data.ai_instructions && data.ai_instructions.length > 0) {
      console.log('Seeding ai_instructions...');
      await client.query('TRUNCATE ai_instructions RESTART IDENTITY CASCADE');

      for (const instruction of data.ai_instructions) {
        await client.query(`
          INSERT INTO ai_instructions (
            category, instruction, priority, is_active
          ) VALUES ($1, $2, $3, $4)
        `, [
          instruction.category,
          instruction.instruction,
          instruction.priority,
          instruction.is_active
        ]);
      }
      console.log(`  ✓ ${data.ai_instructions.length} AI instructions seeded`);
    }

    // 7. Seed demo JD analyses
    if (data.demo_jds && data.demo_jds.length > 0) {
      console.log('Seeding demo jd_analyses...');
      // Only delete demo entries, preserve user-generated analyses
      await client.query('DELETE FROM jd_analyses WHERE is_demo = TRUE');

      for (const jd of data.demo_jds) {
        await client.query(`
          INSERT INTO jd_analyses (
            job_description, verdict, where_i_dont_fit, what_transfers,
            recommendation, opening_paragraph, is_demo, demo_type
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          jd.job_description,
          jd.verdict,
          jd.where_i_dont_fit,
          jd.what_transfers,
          jd.recommendation,
          jd.opening_paragraph,
          jd.is_demo,
          jd.demo_type
        ]);
      }
      console.log(`  ✓ ${data.demo_jds.length} demo JD analyses seeded`);
    }

    await client.query('COMMIT');
    console.log('Seed completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function runSeed() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('No DATABASE_URL found - skipping seeding (local dev mode without DB)');
    return;
  }

  // Load seed data
  const data = loadSeedData();
  if (!data) {
    return;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    await seedDatabase(client, data);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSeed();

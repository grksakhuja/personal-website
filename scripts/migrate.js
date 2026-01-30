/**
 * Database Migration Runner
 *
 * Runs SQL migration files in order.
 * Tracks completed migrations in a migrations table.
 * Safe to run multiple times - only runs new migrations.
 */

import pg from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '..', 'migrations');

async function runMigrations() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.log('No DATABASE_URL found - skipping migrations (local dev mode)');
    return;
  }

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Get list of already executed migrations
    const { rows: executed } = await client.query(
      'SELECT filename FROM _migrations ORDER BY filename'
    );
    const executedFiles = new Set(executed.map(r => r.filename));

    // Get all migration files
    const files = readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    // Run pending migrations
    let migrated = 0;
    for (const file of files) {
      if (executedFiles.has(file)) {
        console.log(`  Skipping ${file} (already executed)`);
        continue;
      }

      console.log(`  Running ${file}...`);
      const sql = readFileSync(join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO _migrations (filename) VALUES ($1)',
          [file]
        );
        await client.query('COMMIT');
        console.log(`  ✓ ${file} completed`);
        migrated++;
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  ✗ ${file} failed:`, err.message);
        throw err;
      }
    }

    if (migrated === 0) {
      console.log('No new migrations to run');
    } else {
      console.log(`Completed ${migrated} migration(s)`);
    }

  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();

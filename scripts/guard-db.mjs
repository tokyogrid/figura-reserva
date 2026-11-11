#!/usr/bin/env node
/**
 * Guard script to prevent prisma db push/studio against non-local databases.
 * Only allows DATABASE_URL starting with "file:" (SQLite) or "sqlite:".
 */

const dbUrl = process.env.DATABASE_URL || '';

const isLocal = dbUrl.startsWith('file:') || dbUrl.startsWith('sqlite:');

if (!isLocal) {
  console.error('❌ BLOCKED: db:push/db:studio only allowed against local SQLite database.');
  console.error(`   Current DATABASE_URL: ${dbUrl.replace(/:[^:@]+@/, ':****@')}`);
  console.error('   Expected: file:./dev.db or sqlite:...');
  console.error('\n   Use npm run local:push or npm run local:studio for local development.');
  process.exit(1);
}

console.log('✅ Guard passed: Local SQLite database detected.');
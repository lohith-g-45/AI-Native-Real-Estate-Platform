const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://postgres.vgpvhoxptqjhfmmgstsb:somasundaram@1972@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to Supabase');
    await client.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS "googleId" varchar UNIQUE, ADD COLUMN IF NOT EXISTS "facebookId" varchar UNIQUE, ADD COLUMN IF NOT EXISTS "twitterId" varchar UNIQUE');
    console.log('Added missing OAuth columns to users table');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();

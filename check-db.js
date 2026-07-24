const { Client } = require('pg');
const fs = require('fs');

if (fs.existsSync('.env')) {
  const lines = fs.readFileSync('.env', 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      process.env[key] = val;
    }
  }
}

const client = new Client({
  user: process.env.DB_USERNAME || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false, servername: process.env.DB_HOST } : false,
});

async function check() {
  try {
    await client.connect();
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(t => t.table_name));
    
    // Attempt to select from "users"
    if (tables.rows.some(t => t.table_name.toLowerCase() === 'users')) {
      const users = await client.query('SELECT * FROM "users"');
      console.log('Users:', users.rows);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();

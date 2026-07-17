const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'real_estate',
  password: 'Lohith.G@45',
  port: 5432,
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

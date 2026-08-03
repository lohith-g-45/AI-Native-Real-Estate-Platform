const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Lohith.G@45',
  port: 5432,
});

async function fix() {
  await client.connect();
  
  // Set all properties to published
  await client.query("UPDATE property_listings SET status = 'published'");
  console.log("All listings published");
  
  await client.end();
}

fix().catch(console.error);

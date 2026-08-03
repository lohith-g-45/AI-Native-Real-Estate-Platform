const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Lohith.G@45',
  port: 5432,
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT * FROM listing_media');
  console.log('Media:', res.rows);
  const res2 = await client.query('SELECT property_id, status FROM property_listings');
  console.log('Listings:', res2.rows);
  await client.end();
}
run();

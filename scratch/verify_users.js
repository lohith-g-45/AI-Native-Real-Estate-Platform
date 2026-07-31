const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres.vgpvhoxptqjhfmmgstsb:somasundaram@1972@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
});
client.connect().then(async () => {
  const res = await client.query('UPDATE users SET "emailVerified" = true');
  console.log('Updated users:', res.rowCount);
  process.exit(0);
}).catch(console.error);

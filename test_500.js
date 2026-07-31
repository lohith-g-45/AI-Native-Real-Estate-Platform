const fetch = require('node-fetch');

async function test() {
  const base = 'http://localhost:3000';
  
  const email = `test${Date.now()}@test.com`;
  console.log('Registering...', email);
  await fetch(`${base}/auth-identity/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!', first_name: 'Test', last_name: 'User', role: 'seller' })
  });
  
  console.log('Logging in...');
  const loginRes = await fetch(`${base}/auth-identity/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token || loginData.data?.access_token || loginData.token;
  console.log('Token acquired.');
  
  console.log('Creating listing...');
  const createRes = await fetch(`${base}/api/listings/create`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const createData = await createRes.json();
  const propId = createData.data.property_id;
  console.log('Property ID:', propId);
  
  const payload = {
    bedrooms: 3,
    bathrooms: 2,
    parking_spaces: 1,
    basement_type: 'none',
    exterior_features: {
      garage: true,
      parking_spaces: 1,
      pool: false,
      backyard: true
    },
    interior_features: {
      fireplace: false
    },
    utilities: {
      heating: 'gas',
      cooling: 'central'
    }
  };
  
  console.log('Saving details...');
  const detailRes = await fetch(`${base}/api/listings/${propId}/details`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  console.log('Status details:', detailRes.status);
  console.log('Response details:', await detailRes.text());

  // Let's also upload a dummy photo so submit works
  console.log('Submitting...');
  const submitRes = await fetch(`${base}/api/listings/${propId}/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('Status submit:', submitRes.status);
  console.log('Response submit:', await submitRes.text());
}

test().catch(console.error);

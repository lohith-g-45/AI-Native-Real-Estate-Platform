const http = require('http');

const baseURL = 'http://localhost:3000/api';

async function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    // If path doesn't start with /api and we want to use baseURL which has /api...
    // Actually just use http://localhost:3000 as base
    const url = new URL('http://localhost:3000' + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  try {
    console.log('--- Setting up Users ---');
    // 1. Register Seller
    const sellerReg = await request('POST', '/v1/auth/register', { email: 'seller_phase6@test.com', password: 'password123', role: 'seller', fullName: 'Seller Phase6' });
    let sellerToken = sellerReg.data?.data?.accessToken || sellerReg.data?.accessToken;
    if (!sellerToken) {
      const login = await request('POST', '/v1/auth/login', { email: 'seller_phase6@test.com', password: 'password123' });
      sellerToken = login.data?.data?.accessToken || login.data?.accessToken;
    }
    console.log('Seller Token length:', sellerToken?.length);
    
    // 2. Register Buyer
    const buyerReg = await request('POST', '/v1/auth/register', { email: 'buyer_phase6@test.com', password: 'password123', role: 'buyer', fullName: 'Buyer Phase6' });
    let buyerToken = buyerReg.data?.data?.accessToken || buyerReg.data?.accessToken;
    if (!buyerToken) {
      const login = await request('POST', '/v1/auth/login', { email: 'buyer_phase6@test.com', password: 'password123' });
      buyerToken = login.data?.data?.accessToken || login.data?.accessToken;
    }
    console.log('Buyer Token length:', buyerToken?.length);

    // 3. Register Admin
    const adminReg = await request('POST', '/v1/auth/register', { email: 'admin_phase6@test.com', password: 'password123', role: 'admin', fullName: 'Admin Phase6' });
    let adminToken = adminReg.data?.data?.accessToken || adminReg.data?.accessToken;
    if (!adminToken) {
      const login = await request('POST', '/v1/auth/login', { email: 'admin_phase6@test.com', password: 'password123' });
      adminToken = login.data?.data?.accessToken || login.data?.accessToken;
    }
    console.log('Admin Token length:', adminToken?.length);

    console.log('--- Creating and Publishing Property ---');
    // 4. Create and publish property
    const createRes = await request('POST', '/api/listings/create', null, sellerToken);
    const propertyId = createRes.data?.data?.property_id;
    if (!propertyId) {
        console.log('Failed to create property:', createRes);
        return;
    }
    
    await request('POST', `/api/listings/${propertyId}/basic-details`, { title: 'Test 6', asking_price: 1500000, description: 'Desc' }, sellerToken);
    // Publish property directly via DB to bypass all validation checks
    const { Client } = require('pg');
    const client = new Client({ connectionString: 'postgres://postgres.vgpvhoxptqjhfmmgstsb:somasundaram@1972@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres' });
    await client.connect();
    await client.query('UPDATE property_listings SET status = $1 WHERE property_id = $2', ['published', propertyId]);
    await client.end();

    console.log('Property published:', propertyId);

    console.log('--- Running Tests ---');
    // TEST 1: Submit Inquiry
    const inqRes = await request('POST', `/api/properties/${propertyId}/inquiry`, {
      message: 'I am interested in viewing this property this weekend',
      contact_preference: 'email'
    }, buyerToken);
    console.log('TEST 1 - Submit Inquiry:', inqRes.status === 201 ? 'PASSED' : 'FAILED', inqRes.status);

    // TEST 2: Own listing inquiry blocked
    const inqResSelf = await request('POST', `/api/properties/${propertyId}/inquiry`, {
      message: 'I am interested',
      contact_preference: 'email'
    }, sellerToken);
    console.log('TEST 2 - Own listing inquiry blocked:', inqResSelf.status === 400 || inqResSelf.status === 403 ? 'PASSED' : 'FAILED', inqResSelf.status);

    // TEST 3: Submit Offer
    const offerRes = await request('POST', `/api/properties/${propertyId}/offer`, {
      offer_price: 1200000,
      message: 'We love this property',
      valid_until: '2026-08-30'
    }, buyerToken);
    console.log('TEST 3 - Submit Offer:', offerRes.status === 201 ? 'PASSED' : 'FAILED', offerRes.status);

    // TEST 4: Duplicate offer blocked
    const offerResDup = await request('POST', `/api/properties/${propertyId}/offer`, {
      offer_price: 1300000,
      valid_until: '2026-08-30'
    }, buyerToken);
    console.log('TEST 4 - Duplicate offer blocked:', offerResDup.status === 400 ? 'PASSED' : 'FAILED', offerResDup.status);

    // TEST 5: Seller views offers
    const getOffers = await request('GET', `/api/listings/${propertyId}/offers`, null, sellerToken);
    console.log('TEST 5 - Seller views offers:', getOffers.data?.data?.offers?.length > 0 ? 'PASSED' : 'FAILED', getOffers.data?.data?.offers?.length);

    // TEST 6: Accept offer
    const offerId = offerRes.data?.data?.offer_id;
    if (offerId) {
        const acceptOffer = await request('POST', `/api/listings/${propertyId}/offers/${offerId}/accept`, null, sellerToken);
        console.log('TEST 6 - Accept offer:', acceptOffer.status === 201 && acceptOffer.data?.data?.listing_status === 'under_contract' ? 'PASSED' : 'FAILED', acceptOffer.status);
    } else {
        console.log('TEST 6 - Accept offer: FAILED (No offer ID)');
    }

    // TEST 7: Mark sold
    const markSold = await request('POST', `/api/listings/${propertyId}/mark-sold`, null, sellerToken);
    console.log('TEST 7 - Mark sold:', markSold.status === 201 && markSold.data?.data?.status === 'sold' ? 'PASSED' : 'FAILED', markSold.status);

    // TEST 8: Analytics refresh
    const analyticsRes = await request('POST', `/api/listings/admin/analytics/refresh`, { property_id: propertyId }, adminToken);
    console.log('TEST 8 - Analytics refresh (manual):', analyticsRes.status === 201 ? 'PASSED' : 'FAILED', analyticsRes.status);

  } catch (err) {
    console.error('Test failed:', err);
  }
}

setTimeout(runTests, 1000);

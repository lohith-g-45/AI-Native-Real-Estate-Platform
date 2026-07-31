const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
const API_BASE = isLocal
    ? `http://${window.location.hostname}:3000/api/listings` 
    : 'https://ai-native-real-estate-platform.onrender.com/api/listings';

async function fetchMyListings() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/seller/my-listings`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const result = await response.json();
    
    if (result.success) {
      renderListings(result.data);
    }
  } catch (err) {
    console.error('Error fetching listings:', err);
    document.getElementById('seller-listings-container').innerHTML = '<div style="padding:20px; color:red;">Failed to load listings.</div>';
  }
}

function renderListings(groupedListings) {
  const container = document.getElementById('seller-listings-container');
  container.innerHTML = ''; // clear loading state
  
  // Flatten all listings into an array to render them
  let allListings = [];
  if (groupedListings.draft) allListings = allListings.concat(groupedListings.draft);
  if (groupedListings.under_review) allListings = allListings.concat(groupedListings.under_review);
  if (groupedListings.published) allListings = allListings.concat(groupedListings.published);
  
  if (allListings.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--muted); background: #fff; border-radius: 16px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
        You haven't added any listings yet. <br>
        <a href="add_listing.html" style="color: var(--blue); font-weight: 700; margin-top: 10px; display: inline-block;">+ Add Your First Listing</a>
      </div>
    `;
    return;
  }

  allListings.forEach(listing => {
    // Determine status badge color
    let statusBg = '#e2e8f0';
    let statusColor = '#64748b';
    let statusIcon = 'clock';
    let statusText = 'Draft';
    let statusDesc = 'Listing is incomplete.';

    if (listing.status === 'published') {
      statusBg = 'var(--green)';
      statusColor = '#fff';
      statusIcon = 'check-circle';
      statusText = 'Active';
      statusDesc = 'Your listing is live and visible to potential buyers.';
    } else if (listing.status === 'under_review') {
      statusBg = '#f59e0b';
      statusColor = '#fff';
      statusIcon = 'search';
      statusText = 'Under Review';
      statusDesc = 'Admins are reviewing your listing.';
    }

    const priceFormatted = listing.asking_price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.asking_price) : 'Price TBD';
    const dateFormatted = new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const imgUrl = listing.cover_photo_url || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop';
    
    // Default analytics to 0 since our getSellerListings doesn't populate analytics deeply by default
    const views = 0;
    const saves = 0;
    const inquiries = 0;

    const html = `
    <div style="background:#fff; border-radius:16px; border:1px solid #e2e8f0; display:flex; padding:20px; gap:24px; margin-bottom:30px; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
      <!-- Listing Image -->
      <div style="position:relative; width:340px; height:220px; border-radius:12px; overflow:hidden; flex-shrink:0; background: #e2e8f0;">
        <img src="${imgUrl}" style="width:100%; height:100%; object-fit:cover;" alt="Property Image" onerror="this.src='https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop'"/>
        <div style="position:absolute; top:12px; left:12px; background:${statusBg}; color:${statusColor}; font-size:12px; font-weight:700; padding:4px 10px; border-radius:6px;">${statusText}</div>
      </div>
      
      <!-- Listing Info -->
      <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h3 style="font-size:19px; font-weight:800; color:#0f172a; margin-bottom:8px; letter-spacing:-0.2px;">${listing.title || 'Untitled Property'}</h3>
            <div style="font-size:13px; color:#64748b; display:flex; align-items:center; gap:6px; margin-bottom:20px;">
              <i data-feather="map-pin" style="width:14px;height:14px;"></i> ${listing.city || 'Location Pending'}
            </div>
            <div style="font-size:24px; font-weight:800; color:var(--blue); margin-bottom:24px;">${priceFormatted}</div>
            
            <div style="display:flex; gap:24px; color:#475569; font-size:13px; font-weight:600; margin-bottom:24px;">
              <span style="display:flex; align-items:center; gap:6px;"><i data-feather="eye" style="width:16px;height:16px;"></i> ${views}</span>
              <span style="display:flex; align-items:center; gap:6px;"><i data-feather="heart" style="width:16px;height:16px;"></i> ${saves}</span>
              <span style="display:flex; align-items:center; gap:6px;"><i data-feather="message-square" style="width:16px;height:16px;"></i> ${inquiries}</span>
            </div>
            
            <div style="font-size:12.5px; color:#94a3b8; font-weight:500;">Listed on ${dateFormatted}</div>
          </div>
          <div>
             <i data-feather="more-vertical" style="width:20px;height:20px;color:#94a3b8;cursor:pointer;"></i>
          </div>
        </div>
      </div>
      
      <!-- Right Action Box -->
      <div style="width:310px; display:flex; flex-direction:column; justify-content:center; padding-left:24px; border-left:1px solid #e2e8f0;">
         <div style="background:#f8fafc; padding:20px; border-radius:12px; margin-bottom:20px;">
           <div style="font-size:13px; color:#475569; font-weight:600; margin-bottom:8px;">Listing Status</div>
           <div style="display:flex; align-items:center; gap:6px; color:${listing.status === 'published' ? 'var(--green)' : listing.status === 'under_review' ? '#ea580c' : '#64748b'}; font-weight:700; font-size:14.5px; margin-bottom:8px;">
             <i data-feather="${statusIcon}" style="width:16px;height:16px;"></i> ${statusText}
           </div>
           <div style="font-size:12px; color:#64748b; line-height:1.5;">${statusDesc}</div>
         </div>
         <div style="display:flex; gap:12px;">
           <button style="flex:1; background:#fff; border:1px solid var(--blue); color:var(--blue); font-weight:700; font-size:13.5px; padding:11px 0; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif;">View</button>
           <button style="flex:1; background:var(--blue); border:1px solid var(--blue); color:#fff; font-weight:700; font-size:13.5px; padding:11px 0; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif;">Edit</button>
         </div>
      </div>
    </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
  });
  
  if (window.feather) {
    feather.replace();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchMyListings();
});

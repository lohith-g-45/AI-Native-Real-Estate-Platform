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
  Object.values(groupedListings).forEach(group => {
    if (Array.isArray(group)) {
      allListings = allListings.concat(group);
    }
  });
  
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
    } else if (listing.status === 'submitted' || listing.status === 'verification_pending' || listing.status === 'under_review') {
      statusBg = '#f59e0b';
      statusColor = '#fff';
      statusIcon = 'search';
      statusText = 'Under Review';
      statusDesc = 'Admins are reviewing your listing.';
    }

    const priceFormatted = listing.asking_price ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.asking_price) : 'Price TBD';
    const dateFormatted = new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    let imgUrl = listing.cover_photo_url;
    if (imgUrl && !/^https?:\/\//.test(imgUrl)) {
      imgUrl = `${API_BASE.replace('/api/listings', '')}${imgUrl}`;
    }
    imgUrl = imgUrl || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&auto=format&fit=crop';
    
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
          <div style="position:relative;" class="listing-dropdown-container">
             <i data-feather="more-vertical" style="width:20px;height:20px;color:#94a3b8;cursor:pointer;" onclick="toggleDropdown('${listing.property_id}', event)"></i>
             <div id="dropdown-${listing.property_id}" style="display:none; position:absolute; right:0; top:24px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.1); width:120px; z-index:10; overflow:hidden;">
               <div style="padding:10px 16px; font-size:13px; color:#ef4444; cursor:pointer; font-weight:600; transition: background 0.15s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='#fff'" onclick="deleteListing('${listing.property_id}')">Delete</div>
             </div>
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
           <button style="flex:1; background:#fff; border:1px solid var(--blue); color:var(--blue); font-weight:700; font-size:13.5px; padding:11px 0; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif;" onclick="viewListing('${listing.property_id}')">View</button>
           <button style="flex:1; background:var(--blue); border:1px solid var(--blue); color:#fff; font-weight:700; font-size:13.5px; padding:11px 0; border-radius:8px; cursor:pointer; font-family:'Inter',sans-serif;" onclick="editListing('${listing.property_id}', ${listing.completion_percentage})">Edit</button>
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

// Helper Functions for Listing Actions
window.toggleDropdown = function(id, event) {
  if (event) event.stopPropagation();
  const el = document.getElementById(`dropdown-${id}`);
  if (el) {
    const isHidden = el.style.display === 'none';
    // Close all other dropdowns
    document.querySelectorAll('[id^="dropdown-"]').forEach(d => d.style.display = 'none');
    if (isHidden) el.style.display = 'block';
  }
};

// Close dropdown if clicked outside
document.addEventListener('click', function(e) {
  // If we didn't click inside a dropdown-container, close them all
  if (!e.target.closest('.listing-dropdown-container')) {
    document.querySelectorAll('[id^="dropdown-"]').forEach(el => {
      el.style.display = 'none';
    });
  }
});

window.deleteListing = async function(id) {
  if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
  const token = localStorage.getItem('accessToken');
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      fetchMyListings(); // Refresh the list
    } else {
      const data = await res.json();
      alert('Failed to delete: ' + (data.message || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to delete listing. Please check your connection.');
  }
};

window.editListing = function(id) {
  // Clear any existing partial state
  sessionStorage.removeItem('hh_add_listing_state');
  // Navigate to init step with editId, which will fetch data and route automatically
  window.location.href = `add_listing_init.html?editId=${id}`;
};

window.viewListing = function(id) {
  // If we had a dedicated page, we'd navigate there.
  // For now, we can redirect to a property details page (which we will build)
  window.location.href = `property_details.html?id=${id}`;
};

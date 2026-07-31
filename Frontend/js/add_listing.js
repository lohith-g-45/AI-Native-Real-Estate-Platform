/* ============================================================
   Add New Listing — shared wizard engine
   Used by add_listing_init.html, add_listing_basic.html,
   add_listing_location.html and add_listing_features.html.

   Responsible for:
   - talking to the existing /api/listings backend (same endpoints
     & contract as the previous single-page wizard)
   - persisting the seller's in-progress answers in sessionStorage
     so nothing is lost when moving between the four pages
   - rendering the shared step indicator
   ============================================================ */

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
const API_BASE = isLocal
    ? `http://${window.location.hostname}:3000/api/listings` 
    : 'https://ai-native-real-estate-platform.onrender.com/api/listings';
const MEDIA_ORIGIN = isLocal ? `http://${window.location.hostname}:3000` : 'https://ai-native-real-estate-platform.onrender.com';
const WIZ_KEY = 'hh_add_listing_state';

const WIZ_STEPS = [
  { label: 'Initialize', page: 'add_listing_init.html' },
  { label: 'Basic Details', page: 'add_listing_basic.html' },
  { label: 'Location', page: 'add_listing_location.html' },
  { label: 'Features', page: 'add_listing_features.html' },
];

const MEDIA_LABEL_CYCLE = ['cover_photo', 'living_room', 'kitchen', 'bedroom', 'bathroom', 'dining_room', 'exterior', 'backyard'];

/* ── Wizard state (sessionStorage) ── */

function getWizardState() {
  try {
    return JSON.parse(sessionStorage.getItem(WIZ_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function setWizardState(patch) {
  const state = getWizardState();
  Object.assign(state, patch);
  sessionStorage.setItem(WIZ_KEY, JSON.stringify(state));
  return state;
}

function clearWizardState() {
  sessionStorage.removeItem(WIZ_KEY);
}

function requirePropertyId() {
  const state = getWizardState();
  if (!state.propertyId) {
    window.location.href = 'add_listing_init.html';
    return null;
  }
  return state.propertyId;
}

/* ── API helper (JSON + multipart) ── */

async function apiRequest(endpoint, method, body = null, isMultipart = false) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert('You must be logged in to create a listing.');
    window.location.href = 'login.html';
    throw new Error('Not authenticated');
  }

  const options = { method, headers: { Authorization: `Bearer ${token}` } };

  if (body !== null) {
    if (isMultipart) {
      options.body = body;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  
  if (response.status === 401) {
    localStorage.removeItem('accessToken');
    window.location.href = 'login.html';
    // Return a never-resolving promise to stop the caller from continuing
    return new Promise(() => {});
  }

  if (!response.ok) {
    let errorData = {};
    try { errorData = await response.json(); } catch (e) { /* no body */ }
    throw new Error(errorData.message || 'API Request Failed');
  }
  if (response.status === 204) return { success: true, data: null };
  return response.json();
}

/* ── Step indicator (shared markup, injected via JS) ── */

function renderWizSteps(activeIndex) {
  const el = document.getElementById('wizSteps');
  if (!el) return;
  const pct = ((activeIndex - 1) / (WIZ_STEPS.length - 1)) * 100;
  let html = `<div class="wiz-progress-fill" style="width:${pct}%"></div>`;
  WIZ_STEPS.forEach((s, i) => {
    const n = i + 1;
    let cls = 'wiz-step';
    if (n < activeIndex) cls += ' done';
    else if (n === activeIndex) cls += ' active';
    const numContent = n < activeIndex ? '<i data-feather="check" style="width:16px;height:16px;"></i>' : n;
    html += `<div class="${cls}"><div class="wiz-step-num">${numContent}</div><div class="wiz-step-label">${s.label}</div></div>`;
  });
  el.innerHTML = html;
  if (window.feather) feather.replace();
}

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function formatMoney(n) {
  const num = parseFloat(n);
  if (!num || isNaN(num)) return '—';
  return '$' + num.toLocaleString('en-CA', { maximumFractionDigits: 0 });
}

/* ── Counters / toggles (Step 4 feature cards) ── */

function setupCounter(id, initial, min, max, onChange) {
  const wrap = document.getElementById(id);
  if (!wrap) return;
  const valEl = wrap.querySelector('.val');
  let n = clamp(parseInt(initial, 10) || 0, min, max);
  valEl.textContent = n;
  wrap.querySelector('.dec').addEventListener('click', () => {
    n = clamp(n - 1, min, max);
    valEl.textContent = n;
    if (onChange) onChange();
  });
  wrap.querySelector('.inc').addEventListener('click', () => {
    n = clamp(n + 1, min, max);
    valEl.textContent = n;
    if (onChange) onChange();
  });
}

function getCounter(id) {
  const el = document.getElementById(id);
  const valEl = el && el.querySelector('.val');
  return valEl ? parseInt(valEl.textContent, 10) || 0 : 0;
}

function setupToggle(id, initial, onChange) {
  const input = document.getElementById(id);
  if (!input) return;
  input.checked = !!initial;
  updateToggleLabel(id);
  input.addEventListener('change', () => {
    updateToggleLabel(id);
    if (onChange) onChange();
  });
}

function getToggle(id) {
  const el = document.getElementById(id);
  return el ? el.checked : false;
}

function updateToggleLabel(id) {
  const input = document.getElementById(id);
  const lbl = document.getElementById(id + '_val');
  if (lbl && input) {
    lbl.textContent = input.checked ? 'Yes' : 'No';
    lbl.classList.toggle('on', input.checked);
  }
}

/* ============================================================
   STEP 1 — Initialize
   ============================================================ */

function initStep1() {
  renderWizSteps(1);
  const btn = document.getElementById('initBtn');
  if (!btn) return;

  const existing = getWizardState();
  if (existing.propertyId) {
    btn.innerHTML = 'Continue Listing <i data-feather="arrow-right" style="width:16px;height:16px;"></i>';
    if (window.feather) feather.replace();
  }

  btn.addEventListener('click', async () => {
    const state = getWizardState();
    if (state.propertyId) {
      const target = WIZ_STEPS[(state.currentStep || 2) - 1].page;
      window.location.href = target;
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Initializing…';
    try {
      const result = await apiRequest('/create', 'POST', {});
      setWizardState({ propertyId: result.data.property_id, currentStep: 2 });
      window.location.href = 'add_listing_basic.html';
    } catch (err) {
      alert('Error: ' + err.message);
      btn.disabled = false;
      btn.innerHTML = 'Initialize Listing <i data-feather="arrow-right" style="width:16px;height:16px;"></i>';
      if (window.feather) feather.replace();
    }
  });
}

/* ============================================================
   STEP 2 — Basic Details
   ============================================================ */

function initStep2() {
  renderWizSteps(2);
  const propertyId = requirePropertyId();
  if (!propertyId) return;

  const basic = getWizardState().basic || {};
  const els = {
    listing_type: document.getElementById('listing_type'),
    property_category: document.getElementById('property_category'),
    title: document.getElementById('title'),
    description: document.getElementById('description'),
    asking_price: document.getElementById('asking_price'),
    property_type: document.getElementById('property_type'),
  };

  Object.keys(els).forEach((k) => {
    if (basic[k] !== undefined && basic[k] !== null && basic[k] !== '') els[k].value = basic[k];
  });

  function updateSummary() {
    document.getElementById('sumTitle').textContent = els.title.value.trim() || 'Untitled property';
    document.getElementById('sumType').textContent = els.property_type.value || '—';
    document.getElementById('sumListingType').textContent = els.listing_type.value === 'for_rent' ? 'For Rent' : 'For Sale';
    document.getElementById('sumPrice').textContent = els.asking_price.value ? `${formatMoney(els.asking_price.value)} CAD` : '—';
  }
  Object.values(els).forEach((el) => el.addEventListener('input', updateSummary));
  updateSummary();

  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.addEventListener('click', () => { window.location.href = 'add_listing_init.html'; });

  document.getElementById('nextBtn').addEventListener('click', async () => {
    const errorDiv = document.getElementById('step2Error');
    errorDiv.textContent = '';

    const title = els.title.value.trim();
    const description = els.description.value.trim();
    const price = parseFloat(els.asking_price.value);

    const errors = [];
    if (title.length < 10) errors.push('Property Title must be at least 10 characters.');
    if (description.length < 50) errors.push('Property Description must be at least 50 characters.');
    if (!price || price <= 0) errors.push('Please enter a valid asking price.');
    if (errors.length) { errorDiv.textContent = errors.join(' '); return; }

    const payload = {
      listing_type: els.listing_type.value,
      property_category: els.property_category.value,
      title,
      description,
      asking_price: price,
      property_type: els.property_type.value,
    };

    const btn = document.getElementById('nextBtn');
    btn.disabled = true;
    btn.textContent = 'Saving…';
    try {
      await apiRequest(`/${propertyId}/basic-details`, 'POST', payload);
      setWizardState({ basic: payload, currentStep: 3 });
      window.location.href = 'add_listing_location.html';
    } catch (err) {
      errorDiv.textContent = err.message;
      btn.disabled = false;
      btn.textContent = 'Save & Continue';
    }
  });
}

/* ============================================================
   STEP 3 — Location
   ============================================================ */

function initStep3() {
  renderWizSteps(3);
  const propertyId = requirePropertyId();
  if (!propertyId) return;

  const loc = getWizardState().location || {};
  const els = {
    address: document.getElementById('address'),
    city: document.getElementById('city'),
    province: document.getElementById('province'),
    zip_code: document.getElementById('zip_code'),
    country: document.getElementById('country')
  };
  const fieldMap = { address: 'street_address', city: 'city', province: 'province', zip_code: 'postal_code', country: 'country' };

  Object.keys(els).forEach((k) => {
    const backendKey = fieldMap[k];
    if (loc[backendKey] !== undefined && loc[backendKey] !== null && loc[backendKey] !== '') els[k].value = loc[backendKey];
  });

  function showVerified() {
    const v = document.getElementById('locVerified');
    if (v) v.classList.add('show');
  }

  if (loc.verified) {
    showVerified();
  }

  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.addEventListener('click', () => { window.location.href = 'add_listing_basic.html'; });

  document.getElementById('nextBtn').addEventListener('click', async () => {
    const errorDiv = document.getElementById('step3Error');
    errorDiv.textContent = '';
    
    const btn = document.getElementById('nextBtn');
    btn.disabled = true;
    btn.innerHTML = 'Verifying…';

    const errors = [];
    if (!els.address.value.trim()) errors.push('Address is required.');
    if (!els.city.value.trim()) errors.push('City is required.');
    if (!els.province.value.trim()) errors.push('Province is required.');
    if (!els.zip_code.value.trim()) errors.push('Postal code is required.');
    if (!els.country.value.trim()) errors.push('Country is required.');
    
    if (errors.length) { 
      errorDiv.textContent = errors.join(' '); 
      btn.disabled = false;
      btn.innerHTML = 'Next <i data-feather="arrow-right" style="width:16px;height:16px;"></i>';
      if (window.feather) feather.replace();
      return; 
    }

    const payload = {
      street_address: els.address.value.trim(),
      city: els.city.value.trim(),
      province: els.province.value.trim(),
      postal_code: els.zip_code.value.trim(),
      country: els.country.value.trim(),
      latitude: 0,
      longitude: 0,
    };

    try {
      await apiRequest(`/${propertyId}/location`, 'POST', payload);
      setWizardState({ location: { ...payload, verified: true }, currentStep: 4 });
      showVerified();
      setTimeout(() => { window.location.href = 'add_listing_features.html'; }, 900);
    } catch (err) {
      errorDiv.textContent = err.message;
      btn.disabled = false;
      btn.textContent = 'Save & Continue';
    }
  });
}

async function loadAmenities(propertyId) {
  const grid = document.getElementById('amenitiesGrid');
  if (!grid) return;
  try {
    // The backend generates nearby-amenity mock data ~500ms after location is saved.
    await new Promise((r) => setTimeout(r, 1000));
    const res = await apiRequest(`/${propertyId}/location`, 'GET');
    const d = res.data || {};
    setAmenityCount('amSchools', (d.nearby_schools || []).length);
    setAmenityCount('amTransit', (d.nearby_subway || []).length + (d.nearby_bus_stops || []).length);
    setAmenityCount('amRestaurants', (d.nearby_restaurants || []).length);
    setAmenityCount('amParks', (d.nearby_parks || []).length);
  } catch (e) {
    // amenities are a nice-to-have; a failure here shouldn't block the wizard
  }
}

function setAmenityCount(id, n) {
  const el = document.getElementById(id);
  if (el) el.textContent = n;
}

/* ============================================================
   STEP 4 — Features & Photos
   ============================================================ */

function initStep4() {
  renderWizSteps(4);
  const propertyId = requirePropertyId();
  if (!propertyId) return;

  const state = getWizardState();
  const feat = state.features || {};
  let photos = state.photos || [];

  function setSaveNote(text) {
    const el = document.getElementById('saveNote');
    if (el) el.textContent = text;
  }

  function updateCompletion(pct) {
    const p = clamp(pct || 0, 0, 100);
    document.getElementById('completionPct').textContent = p + '%';
    document.getElementById('completionBar').style.width = p + '%';
  }

  function collectFeaturesPayload() {
    return {
      bedrooms: getCounter('bedrooms'),
      bathrooms: getCounter('bathrooms'),
      square_feet: parseFloat(document.getElementById('square_feet').value) || undefined,
      year_built: parseInt(document.getElementById('year_built').value, 10) || undefined,
      basement_type: document.getElementById('basement_type').value,
      exterior_features: {
        garage: getToggle('garage'),
        parking_spaces: getCounter('parking_spaces'),
        pool: getToggle('pool'),
        backyard: getToggle('backyard'),
      },
      interior_features: {
        fireplace: getToggle('fireplace'),
      },
      utilities: {
        heating: document.getElementById('heating').value,
        cooling: document.getElementById('cooling').value,
      },
    };
  }

  let saveTimer = null;
  async function saveFeatures(silent) {
    const payload = collectFeaturesPayload();
    setWizardState({ features: payload });
    try {
      const res = await apiRequest(`/${propertyId}/details`, 'POST', payload);
      updateCompletion(res.data.completion_percentage);
      setSaveNote('All changes are saved automatically');
    } catch (err) {
      if (!silent) throw err;
      setSaveNote('Could not save changes — check your connection');
    }
  }
  function scheduleAutosave() {
    clearTimeout(saveTimer);
    setSaveNote('Saving…');
    saveTimer = setTimeout(() => saveFeatures(true), 700);
  }

  setupCounter('bedrooms', feat.bedrooms ?? 3, 0, 20, scheduleAutosave);
  setupCounter('bathrooms', feat.bathrooms ?? 2, 0, 20, scheduleAutosave);
  setupCounter('parking_spaces', feat.parking_spaces ?? 1, 0, 10, scheduleAutosave);
  setupToggle('garage', feat.exterior_features ? feat.exterior_features.garage : true, scheduleAutosave);
  setupToggle('fireplace', feat.interior_features ? feat.interior_features.fireplace : false, scheduleAutosave);
  setupToggle('pool', feat.exterior_features ? feat.exterior_features.pool : false, scheduleAutosave);
  setupToggle('backyard', feat.exterior_features ? feat.exterior_features.backyard : true, scheduleAutosave);

  const basementEl = document.getElementById('basement_type');
  const heatingEl = document.getElementById('heating');
  const coolingEl = document.getElementById('cooling');
  const yearEl = document.getElementById('year_built');
  const sqftEl = document.getElementById('square_feet');

  if (feat.basement_type) basementEl.value = feat.basement_type;
  if (feat.utilities && feat.utilities.heating) heatingEl.value = feat.utilities.heating;
  if (feat.utilities && feat.utilities.cooling) coolingEl.value = feat.utilities.cooling;
  if (feat.year_built) yearEl.value = feat.year_built;
  if (feat.square_feet) sqftEl.value = feat.square_feet;

  [basementEl, heatingEl, coolingEl, yearEl, sqftEl].forEach((el) => {
    el.addEventListener('input', scheduleAutosave);
    el.addEventListener('change', scheduleAutosave);
  });

  const backBtn = document.getElementById('backBtn');
  if (backBtn) backBtn.addEventListener('click', () => { window.location.href = 'add_listing_location.html'; });

  /* ── Photos ── */

  function renderPhotos() {
    const grid = document.getElementById('photoGrid');
    const visible = photos.slice(0, 4);
    const extra = photos.length - visible.length;
    let html = '';
    visible.forEach((p) => {
      if (p.uploading) {
        html += '<div class="wiz-photo-tile uploading"><div class="spin"></div></div>';
      } else {
        const src = /^https?:\/\//.test(p.url) ? p.url : `${MEDIA_ORIGIN}${p.url}`;
        html += `<div class="wiz-photo-tile">
          <img src="${src}" alt="Property photo" onerror="this.style.display='none';">
          ${p.is_cover ? '<span class="cover-badge">Cover</span>' : ''}
          <button type="button" class="rm-btn" data-media-id="${p.media_id || ''}">&times;</button>
        </div>`;
      }
    });
    if (extra > 0) html += `<div class="wiz-photo-tile more">+${extra}<br>More</div>`;
    grid.innerHTML = html;
    grid.querySelectorAll('.rm-btn').forEach((btn) => {
      btn.addEventListener('click', () => removePhoto(btn.dataset.mediaId));
    });
  }

  async function uploadPhoto(file) {
    const tempId = 'tmp_' + Date.now() + Math.random().toString(16).slice(2);
    photos.push({ tempId, uploading: true });
    renderPhotos();
    try {
      const savedCount = photos.filter((p) => !p.uploading).length;
      const label = MEDIA_LABEL_CYCLE[savedCount % MEDIA_LABEL_CYCLE.length];
      const isCover = !photos.some((p) => p.is_cover);
      const form = new FormData();
      form.append('file', file);
      form.append('label', label);
      form.append('is_cover', isCover ? 'true' : 'false');

      const res = await apiRequest(`/${propertyId}/media`, 'POST', form, true);
      const idx = photos.findIndex((p) => p.tempId === tempId);
      const saved = { media_id: res.data.media_id, url: res.data.url, label: res.data.label, is_cover: isCover };
      if (idx !== -1) photos[idx] = saved;
      setWizardState({ photos });

      const progress = await apiRequest(`/${propertyId}/progress`, 'GET');
      updateCompletion(progress.data.completion_percentage);
    } catch (err) {
      photos = photos.filter((p) => p.tempId !== tempId);
      alert('Photo upload failed: ' + err.message);
    }
    renderPhotos();
  }

  async function removePhoto(mediaId) {
    if (!mediaId) return;
    try {
      await apiRequest(`/${propertyId}/media/${mediaId}`, 'DELETE');
      photos = photos.filter((p) => p.media_id !== mediaId);
      setWizardState({ photos });
      renderPhotos();
    } catch (err) {
      alert('Could not remove photo: ' + err.message);
    }
  }

  async function handleFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    for (const file of files) {
      await uploadPhoto(file);
    }
  }

  const dz = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  dz.addEventListener('click', () => fileInput.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('drag');
    handleFiles(e.dataTransfer.files);
  });
  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
    fileInput.value = '';
  });

  renderPhotos();

  apiRequest(`/${propertyId}/progress`, 'GET')
    .then((res) => updateCompletion(res.data.completion_percentage))
    .catch(() => {});

  document.getElementById('publishBtn').addEventListener('click', async () => {
    const btn = document.getElementById('publishBtn');
    btn.disabled = true;
    btn.textContent = 'Publishing…';
    try {
      await saveFeatures(false);
      await apiRequest(`/${propertyId}/submit`, 'POST', {});
      clearWizardState();
      alert('Listing successfully created and submitted for review!');
      window.location.href = 'sell.html';
    } catch (err) {
      alert('Error: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Review & Publish';
    }
  });
}

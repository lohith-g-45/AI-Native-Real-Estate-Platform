const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
const API_BASE = isLocal
    ? `http://${window.location.hostname}:3000/api/listings` 
    : 'https://ai-native-real-estate-platform.onrender.com/api/listings';
let currentPropertyId = sessionStorage.getItem('currentPropertyId') || null;

function saveFormState() {
  const activeStep = document.querySelector('.step-content.active');
  if (activeStep) {
    const stepNum = activeStep.id.split('-')[1];
    sessionStorage.setItem('currentStep', stepNum);
  }
  if (currentPropertyId) {
    sessionStorage.setItem('currentPropertyId', currentPropertyId);
  }
  
  const inputs = document.querySelectorAll('input, select, textarea');
  const formData = {};
  inputs.forEach(input => {
    if (input.id) formData[input.id] = input.value;
  });
  sessionStorage.setItem('formData', JSON.stringify(formData));
}

function restoreFormState() {
  const data = JSON.parse(sessionStorage.getItem('formData') || '{}');
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (input.id && data[input.id] !== undefined) {
      input.value = data[input.id];
    }
  });
}

async function apiRequest(endpoint, method, body = null) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    alert("You must be logged in to create a listing.");
    window.location.href = 'login.html';
    throw new Error('Not authenticated');
  }
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  if (body) {
    if (body instanceof FormData) {
      options.body = body;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API Request Failed');
  }
  return await response.json();
}

async function nextStep(currentStep) {
  try {
    if (currentStep === 1) {
      // Step 1: Initialize Property
      const result = await apiRequest('/create', 'POST', {});
      currentPropertyId = result.data.property_id;
      showStep(2);
    } else if (currentStep === 2) {
      // Client-side validation
      const errorDiv = document.getElementById('step-2-error');
      errorDiv.innerText = '';
      
      const title = document.getElementById('title').value;
      const description = document.getElementById('description').value;
      
      let errors = [];
      if (title.length < 10) errors.push('Property Title must be at least 10 characters.');
      if (description.length < 50) errors.push('Property Description must be at least 50 characters.');
      
      if (errors.length > 0) {
        errorDiv.innerText = errors.join(' ');
        return;
      }
      
      // Step 2: Save Basic Details
      const payload = {
        listing_type: document.getElementById('listing_type').value,
        property_category: document.getElementById('property_category').value,
        title: title,
        description: description,
        asking_price: parseFloat(document.getElementById('asking_price').value) || 0,
        property_type: document.getElementById('property_type').value,
      };
      await apiRequest(`/${currentPropertyId}/basic-details`, 'POST', payload);
      showStep(3);
    } else if (currentStep === 3) {
      // Step 3: Save Location
      const payload = {
        street_address: document.getElementById('street_address').value,
        city: document.getElementById('city').value,
        province: document.getElementById('province').value,
        postal_code: document.getElementById('postal_code').value,
        country: document.getElementById('country').value,
        latitude: 43.6532,
        longitude: -79.3832
      };
      await apiRequest(`/${currentPropertyId}/location`, 'POST', payload);
      showStep(4);
    } else if (currentStep === 4) {
      // Step 4: Save Details
      const payload = {
        bedrooms: parseInt(document.getElementById('bedrooms').value) || 0,
        bathrooms: parseInt(document.getElementById('bathrooms').value) || 0,
        square_feet: parseInt(document.getElementById('square_feet').value) || 0,
        lot_size: parseInt(document.getElementById('lot_size').value) || 0,
        year_built: parseInt(document.getElementById('year_built').value) || new Date().getFullYear(),
      };
      await apiRequest(`/${currentPropertyId}/details`, 'POST', payload);
      showStep(5);
    } else if (currentStep === 5) {
      // Step 5: Save Media
      const fileInput = document.getElementById('media_file');
      const files = fileInput.files;

      if (files.length === 0) {
        alert("Please select at least one photo or video.");
        return;
      }

      const btn = document.getElementById('media-upload-btn');
      const originalText = btn.innerText;
      btn.innerText = 'Uploading... Please wait';
      btn.disabled = true;

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const formData = new FormData();
          formData.append('file', file);
          
          if (i === 0) {
            formData.append('label', 'cover_photo');
            formData.append('is_cover', 'true');
          } else {
            // Default label for additional pictures
            formData.append('label', 'living_room');
            formData.append('is_cover', 'false');
          }

          await apiRequest(`/${currentPropertyId}/media`, 'POST', formData);
        }
        
        btn.innerText = originalText;
        btn.disabled = false;
        showStep(6);
      } catch (err) {
        btn.innerText = originalText;
        btn.disabled = false;
        throw err;
      }
    } else if (currentStep === 6) {
      // Step 6: Save Availability
      const payload = {
        available_from: document.getElementById('available_from').value || new Date().toISOString(),
        contact_phone: document.getElementById('contact_phone').value || undefined,
        instant_booking: document.getElementById('instant_booking').checked,
        viewing_days: ['Monday', 'Tuesday'],
        viewing_time_slots: ['Morning']
      };
      await apiRequest(`/${currentPropertyId}/availability`, 'POST', payload);
      showStep(7);
    } else if (currentStep === 7) {
      // Step 7: Save Verification
      const payload = {
        govt_id_uploaded: true,
        phone_verified: true,
        email_verified: true
      };
      await apiRequest(`/${currentPropertyId}/verification`, 'POST', payload);
      showStep(8);
    }
  } catch (error) {
    console.error(error);
    alert('Error: ' + error.message);
  }
}

function prevStep(currentStep) {
  showStep(currentStep - 1);
}

async function submitListing() {
  try {
    // Final Submit (Verification)
    await apiRequest(`/${currentPropertyId}/submit`, 'POST', {});
    
    sessionStorage.removeItem('currentStep');
    sessionStorage.removeItem('currentPropertyId');
    sessionStorage.removeItem('formData');
    
    alert('Listing successfully created and submitted for review!');
    window.location.href = 'sell.html';
  } catch (error) {
    console.error(error);
    alert('Error: ' + error.message);
  }
}

function showStep(stepNum) {
  document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
  document.getElementById(`step-${stepNum}`).classList.add('active');
  
  // Update indicator
  document.querySelectorAll('.step').forEach((el, idx) => {
    if (idx + 1 < stepNum) {
      el.classList.add('completed');
      el.classList.remove('active');
    } else if (idx + 1 === stepNum) {
      el.classList.add('active');
      el.classList.remove('completed');
    } else {
      el.classList.remove('active', 'completed');
    }
  });
}
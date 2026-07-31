const API_BASE = 'http://localhost:3000/api/listings';
let currentPropertyId = null;

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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  if (body) options.body = JSON.stringify(body);

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
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip_code: document.getElementById('zip_code').value,
        country: document.getElementById('country').value,
      };
      await apiRequest(`/${currentPropertyId}/location`, 'POST', payload);
      showStep(4);
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
    const payload = {
      bedrooms: parseInt(document.getElementById('bedrooms').value) || 0,
      bathrooms: parseFloat(document.getElementById('bathrooms').value) || 0,
      square_feet: parseInt(document.getElementById('square_feet').value) || 0,
      lot_size: parseFloat(document.getElementById('lot_size').value) || 0,
      year_built: parseInt(document.getElementById('year_built').value) || null,
    };
    
    // Save Details
    await apiRequest(`/${currentPropertyId}/details`, 'POST', payload);
    
    // Final Submit (Verification)
    await apiRequest(`/${currentPropertyId}/submit`, 'POST', {});
    
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

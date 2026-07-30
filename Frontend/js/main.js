document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    // Simulate token validation (replace with real API call)
    const isTokenValid = validateToken(authToken);

    if (isTokenValid) {
      window.location.href = "index.html"; // ✅ valid session
    } else {
      window.location.href = "login.html"; // ❌ expired/invalid session
    }
  } else {
    // No token → stay on landing page until user clicks Get Started
    document.querySelector("button").addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }
});

// Dummy validation function (replace with backend check)
function validateToken(token) {
  // Example: check expiry timestamp stored with token
  // For now, just return false to simulate expired session
  return false;
}

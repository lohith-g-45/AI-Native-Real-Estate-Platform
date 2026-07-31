document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // Not logged in! Redirect to login page and remember intent if possible
        const path = window.location.pathname;
        let intent = '';
        if (path.includes('sell.html')) intent = 'sell';
        else if (path.includes('buy.html')) intent = 'buy';
        
        if (intent) {
            sessionStorage.setItem('loginIntent', intent);
        }
        window.location.href = 'login.html';
        return;
    }

    try {
        // Parse JWT Token payload
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);

        // Try to update user names on the dashboard if elements exist
        const nameElements = document.querySelectorAll('.user-name-display');
        if (nameElements.length > 0) {
            // We usually just have email in payload. If we had name, we'd use it.
            const displayName = payload.email ? payload.email.split('@')[0] : 'User';
            nameElements.forEach(el => {
                el.textContent = displayName;
            });
        }
        
        // Check expiration
        if (payload.exp && (payload.exp * 1000) < Date.now()) {
            console.warn("Token expired. Redirecting to login.");
            localStorage.removeItem('accessToken');
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
        console.error("Invalid token format", e);
        localStorage.removeItem('accessToken');
        window.location.href = 'login.html';
    }

    // Handle sign out
    const signOutBtns = document.querySelectorAll('.sign-out-btn, [href="login.html"]');
    signOutBtns.forEach(btn => {
        // If it's a link to login.html inside a dashboard context, assume it's a sign-out button
        if (btn.tagName === 'A' && btn.getAttribute('href') === 'login.html') {
             btn.addEventListener('click', (e) => {
                 e.preventDefault();
                 localStorage.removeItem('accessToken');
                 window.location.href = 'login.html';
             });
        }
    });
});

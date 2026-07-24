const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://ai-native-real-estate-platform.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const welcome = document.querySelector('.welcome');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Clear existing errors
        let errorEl = document.getElementById('form-error');
        if (errorEl) errorEl.remove();

        const loginBtn = loginForm.querySelector('.login-btn');
        loginBtn.disabled = true;
        loginBtn.textContent = 'Signing In...';

        try {
            const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Save token to localStorage
            localStorage.setItem('accessToken', data.accessToken);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';

        } catch (error) {
            showError(error.message, email);
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    function showError(message, email = '') {
        let errorEl = document.getElementById('form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'form-error';
            errorEl.style.marginTop = '15px';
            errorEl.style.textAlign = 'center';
            loginForm.appendChild(errorEl);
        }

        // Render error message text
        errorEl.innerHTML = `
            <p style="color: #ff3b30; font-size: 14px; margin-bottom: 5px;">${message}</p>
        `;

        // If email is unverified, show a quick verification code link
        if (message.includes('verification is pending') || message.includes('verify your email')) {
            const verifyLink = document.createElement('a');
            verifyLink.href = '#';
            verifyLink.textContent = 'Enter Verification Code';
            verifyLink.style.color = '#2D5BFF';
            verifyLink.style.fontSize = '13px';
            verifyLink.style.fontWeight = '600';
            verifyLink.style.textDecoration = 'none';
            verifyLink.style.display = 'block';
            verifyLink.style.marginTop = '5px';
            verifyLink.onclick = (e) => {
                e.preventDefault();
                renderVerificationForm(email);
            };
            errorEl.appendChild(verifyLink);
        }
    }

    function renderVerificationForm(userEmail) {
        welcome.querySelector('h1').textContent = 'Verify Your Email';
        welcome.querySelector('p').textContent = `Please enter the 6-digit verification code sent to ${userEmail}.`;

        loginForm.innerHTML = `
            <div class="input-group">
                <label>Verification Code</label>
                <div class="input-box">
                    <i class="fa-solid fa-key"></i>
                    <input
                        type="text"
                        id="verificationCode"
                        placeholder="Enter 6-digit code"
                        required
                        maxlength="6"
                    >
                </div>
            </div>

            <button type="submit" class="login-btn" style="margin-top: 15px;">
                Verify & Sign In
            </button>

            <div class="signup" style="margin-top: 20px;">
                Didn't get a code?
                <a href="#" id="resendBtn">Resend Code</a>
            </div>
        `;

        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const code = document.getElementById('verificationCode').value;

            // Clear errors
            let errorEl = document.getElementById('form-error');
            if (errorEl) errorEl.remove();

            const verifyBtn = loginForm.querySelector('.login-btn');
            verifyBtn.disabled = true;
            verifyBtn.textContent = 'Verifying...';

            try {
                const response = await fetch(`${API_BASE_URL}/v1/auth/verify-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail,
                        code
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Verification failed');
                }

                // Email is verified! Show success message
                welcome.querySelector('h1').textContent = 'Email Verified!';
                welcome.querySelector('p').textContent = 'Redirecting you to sign in...';
                loginForm.innerHTML = `
                    <div style="text-align: center; color: #4cd964; font-size: 50px; margin: 20px 0;">
                        <i class="fa-regular fa-circle-check"></i>
                    </div>
                `;

                setTimeout(() => {
                    window.location.reload();
                }, 2000);

            } catch (error) {
                showError(error.message, userEmail);
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify & Sign In';
            }
        };

        // Handle Resend
        document.getElementById('resendBtn').onclick = async (e) => {
            e.preventDefault();

            let errorEl = document.getElementById('form-error');
            if (errorEl) errorEl.remove();

            const resendBtn = document.getElementById('resendBtn');
            resendBtn.textContent = 'Sending...';

            try {
                const response = await fetch(`${API_BASE_URL}/v1/auth/verify-email/request`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: userEmail
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Resend failed');
                }

                resendBtn.textContent = 'Sent!';
                setTimeout(() => {
                    resendBtn.textContent = 'Resend Code';
                }, 3000);

            } catch (error) {
                showError(error.message, userEmail);
                resendBtn.textContent = 'Resend Code';
            }
        };
    }
});

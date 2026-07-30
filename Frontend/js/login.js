const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3000' 
    : 'https://ai-native-real-estate-platform.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const welcome = document.querySelector('.welcome');

    // Google Login
    const googleBtn = document.querySelector('.google-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `${API_BASE_URL}/v1/auth/google`;
        });
    }

    // Facebook Login
    const facebookBtn = document.querySelector('.facebook-btn');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `${API_BASE_URL}/v1/auth/facebook`;
        });
    }

    // Twitter Login
    const twitterBtn = document.querySelector('.twitter-btn');
    if (twitterBtn) {
        twitterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `${API_BASE_URL}/v1/auth/twitter`;
        });
    }

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

    const urlParams = new URLSearchParams(window.location.search);
    const redirectIntent = urlParams.get('redirect');
    if (redirectIntent) {
        sessionStorage.setItem('loginIntent', redirectIntent);
    }
    const intent = redirectIntent || sessionStorage.getItem('loginIntent');
    const signupLink = document.querySelector('.signup a');
    if (signupLink && intent) {
        signupLink.href = 'create_account.html?redirect=' + intent;
    }



    const step1Form = document.getElementById('step1Form');
    const otpForm = document.getElementById('otpForm');
    const passwordForm = document.getElementById('passwordForm');

    window.showStep = function(step) {
        document.getElementById('step-1').style.display = 'none';
        document.getElementById('step-2').style.display = 'none';
        document.getElementById('step-3').style.display = 'none';
        document.getElementById(`step-${step}`).style.display = 'block';
    }

    if (step1Form) {
        step1Form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (email) {
                const btn = step1Form.querySelector('.login-btn');
                btn.disabled = true;
                btn.textContent = 'Sending code...';
                try {
                    await fetch(`${API_BASE_URL}/v1/auth/login-otp/request`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    document.getElementById('display-email').innerText = email;
                    showStep(2);
                } catch (error) {
                    alert("Error requesting code: " + error.message);
                } finally {
                    btn.disabled = false;
                    btn.textContent = 'Continue';
                }
            }
        });
    }

    if (otpForm) {
        // OTP box auto-advance logic
        const otpBoxes = otpForm.querySelectorAll('.otp-box');
        otpBoxes.forEach((box, index) => {
            box.addEventListener('input', () => {
                if (box.value.length === 1 && index < otpBoxes.length - 1) {
                    otpBoxes[index + 1].focus();
                }
            });
            box.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && box.value.length === 0 && index > 0) {
                    otpBoxes[index - 1].focus();
                }
            });
        });

        otpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let otp = '';
            otpBoxes.forEach(box => otp += box.value);
            
            if (otp.length < 6) {
                alert("Please enter the full 6-digit code.");
                return;
            }

            const email = document.getElementById('email').value;
            const btn = otpForm.querySelector('.login-btn');
            btn.disabled = true;
            btn.textContent = 'Verifying...';

            try {
                const response = await fetch(`${API_BASE_URL}/v1/auth/login-otp/verify`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, otp })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Invalid code');
                }

                localStorage.setItem('accessToken', data.accessToken);
                
                const currentIntent = sessionStorage.getItem('loginIntent');
                if (currentIntent === 'sell' || data.role === 'seller') {
                    sessionStorage.removeItem('loginIntent');
                    window.location.href = 'sell.html';
                } else if (currentIntent === 'buy') {
                    sessionStorage.removeItem('loginIntent');
                    window.location.href = 'buy.html';
                } else {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                alert("Error: " + error.message);
                otpBoxes.forEach(box => box.value = '');
                otpBoxes[0].focus();
            } finally {
                btn.disabled = false;
                btn.textContent = 'Continue';
            }
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

        // Clear existing errors
        let errorEl = document.getElementById('form-error');
        if (errorEl) errorEl.remove();

        const loginBtn = passwordForm.querySelector('.login-btn');
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
            
            const currentIntent = sessionStorage.getItem('loginIntent');
            if (currentIntent === 'sell' || data.role === 'seller') {
                sessionStorage.removeItem('loginIntent');
                window.location.href = 'sell.html';
            } else if (currentIntent === 'buy') {
                sessionStorage.removeItem('loginIntent');
                window.location.href = 'buy.html';
            } else {
                window.location.href = 'index.html';
            }

        } catch (error) {
            showError(error.message, email);
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });
}

    function showError(message, email = '') {
        let errorEl = document.getElementById('form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'form-error';
            errorEl.style.marginTop = '15px';
            errorEl.style.textAlign = 'center';
            passwordForm.appendChild(errorEl);
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

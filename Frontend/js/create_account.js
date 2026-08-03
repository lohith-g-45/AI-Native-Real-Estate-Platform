const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
const API_BASE_URL = isLocal
    ? `http://${window.location.hostname}:3000` 
    : '';
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const redirectIntent = urlParams.get('redirect');
    if (redirectIntent) {
        sessionStorage.setItem('loginIntent', redirectIntent);
    }
    const intent = redirectIntent || sessionStorage.getItem('loginIntent');
    const role = intent === 'sell' ? 'seller' : 'buyer';

    const signupForm = document.getElementById('signupForm');
    const card = document.querySelector('.signup-card');
    const heading = document.querySelector('.heading');

    // Toggle password visibility
    document.querySelectorAll('.right-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('bx-hide');
                this.classList.add('bx-show');
            } else {
                input.type = 'password';
                this.classList.remove('bx-show');
                this.classList.add('bx-hide');
            }
        });
    });

    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const termsCheck = document.getElementById('termsCheck').checked;

        // Clear existing error message if any
        let errorEl = document.getElementById('form-error');
        if (errorEl) errorEl.remove();

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (!termsCheck) {
            showError('You must agree to the Terms & Privacy Policy');
            return;
        }

        const signupBtn = signupForm.querySelector('.signup-btn');
        signupBtn.disabled = true;
        signupBtn.textContent = 'Creating Account...';

        try {
            const response = await fetch(`${API_BASE_URL}/v1/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    fullName,
                    phoneNumber,
                    role // Assigned based on intent
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            // Successful registration - now prompt for 6-digit verification code
            renderVerificationForm(email, data.emailVerificationCode);

        } catch (error) {
            showError(error.message);
            signupBtn.disabled = false;
            signupBtn.textContent = 'Create Account';
        }
    });

    function showError(message) {
        let errorEl = document.getElementById('form-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.id = 'form-error';
            errorEl.style.color = '#ff3b30';
            errorEl.style.fontSize = '14px';
            errorEl.style.marginTop = '10px';
            errorEl.style.textAlign = 'center';
            signupForm.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    function renderVerificationForm(userEmail, code) {
        // Change heading text
        heading.querySelector('h1').textContent = 'Verify Your Email';
        heading.querySelector('p').textContent = `We sent a 6-digit verification code to ${userEmail}. Enter it below to complete registration.`;

        let codeNotice = '';
        if (code) {
            codeNotice = `
                <div style="background-color: #eaf2ff; border: 1px solid #2D5BFF; color: #2D5BFF; padding: 12px; border-radius: 12px; font-size: 14px; text-align: center; margin-bottom: 15px; font-weight: 500;">
                    [Test Mode] Verification Code: <span style="font-weight: 700; font-size: 16px; letter-spacing: 2px;">${code}</span>
                </div>
            `;
        }

        // Replace signupForm content with verification form
        signupForm.innerHTML = `
            ${codeNotice}
            <div class="input-box">
                <i class='bx bx-key' style="left: 18px; position: absolute; top: 50%; transform: translateY(-50%); color: #7a8ca5; font-size: 20px;"></i>
                <input
                    type="text"
                    id="verificationCode"
                    placeholder="6-Digit Verification Code"
                    required
                    maxlength="6"
                    style="width: 100%; height: 50px; border: 1px solid #D9E4F2; border-radius: 16px; padding-left: 48px; font-size: 14px; outline: none; background: #fff;"
                >
            </div>

            <button class="signup-btn" type="submit" style="width: 100%; height: 50px; border: none; cursor: pointer; border-radius: 16px; background: linear-gradient(135deg, #2D5BFF, #4F7CFF); color: #fff; font-size: 16px; font-weight: 600; margin-top: 15px;">
                Verify & Register
            </button>

            <div class="bottom-text" style="text-align: center; margin-top: 18px; font-size: 14px; color: #666;">
                Didn't get a code?
                <a href="#" id="resendBtn" style="color: #2D5BFF; text-decoration: none; font-weight: 600;">Resend</a>
            </div>
        `;

        // Remove the social login options as registration was initiated
        const divider = card.querySelector('.divider');
        if (divider) divider.remove();
        const googleBtn = card.querySelector('.google-btn');
        if (googleBtn) googleBtn.remove();

        // Handle verification form submission
        signupForm.onsubmit = async (e) => {
            e.preventDefault();
            const code = document.getElementById('verificationCode').value;

            // Clear existing error message if any
            let errorEl = document.getElementById('form-error');
            if (errorEl) errorEl.remove();

            const verifyBtn = signupForm.querySelector('.signup-btn');
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

                // Success! Redirect immediately to waiting.html
                window.location.href = 'waiting.html';

            } catch (error) {
                showError(error.message);
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Verify & Register';
            }
        };

        // Handle resending code
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

                // Update verification code display in test mode
                if (data.verificationCode) {
                    const noticeSpan = signupForm.querySelector('div span');
                    if (noticeSpan) {
                        noticeSpan.textContent = data.verificationCode;
                    }
                }

                resendBtn.textContent = 'Sent!';
                setTimeout(() => {
                    resendBtn.textContent = 'Resend';
                }, 3000);

            } catch (error) {
                showError(error.message);
                resendBtn.textContent = 'Resend';
            }
        };
    }
});

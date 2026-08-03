const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.hostname.startsWith('192.168.') || window.location.hostname.startsWith('10.');
const API_BASE_URL = isLocal
    ? `http://${window.location.hostname}:3000` 
    : '';
document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgotForm');
    const formHeader = document.getElementById('form-header');
    
    if (!forgotForm) return;

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const submitBtn = forgotForm.querySelector('.login-btn');

        // Clear existing errors
        let errorEl = document.getElementById('form-error');
        if (errorEl) errorEl.remove();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const response = await fetch(`${API_BASE_URL}/v1/auth/password-reset/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset code');
            }

            renderResetForm(email, data.resetCode);

        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reset Code';
        }
    });

    function renderResetForm(userEmail, code) {
        let codeNotice = '';
        if (code) {
            codeNotice = `
                <div style="background-color: #eaf2ff; border: 1px solid #2D5BFF; color: #2D5BFF; padding: 12px; border-radius: 12px; font-size: 14px; text-align: center; margin-bottom: 15px; font-weight: 500;">
                    [Test Mode] Reset Code: <span style="font-weight: 700; font-size: 16px; letter-spacing: 2px;">${code}</span>
                </div>
            `;
        }

        formHeader.innerHTML = `
            <h1>Check Your Email</h1>
            <p>We've sent a 6-digit code to <strong>${userEmail}</strong>.</p>
        `;

        forgotForm.innerHTML = `
            ${codeNotice}
            <div class="input-group">
                <label>6-Digit Reset Code</label>
                <div class="input-box">
                    <i class="fa-solid fa-key"></i>
                    <input type="text" id="resetCode" placeholder="Enter 6-digit code" required maxlength="6">
                </div>
            </div>

            <div class="input-group" style="margin-top: 15px;">
                <label>New Password</label>
                <div class="input-box">
                    <i class="fa-solid fa-lock"></i>
                    <input type="password" id="newPassword" placeholder="Enter new password" required>
                    <i class="fa-regular fa-eye toggle-password" style="cursor:pointer;"></i>
                </div>
            </div>

            <button type="submit" class="login-btn" style="margin-top: 25px;">
                Reset Password
            </button>
        `;

        // Attach toggle logic
        forgotForm.querySelectorAll('.toggle-password').forEach(icon => {
            icon.addEventListener('click', function() {
                const input = this.previousElementSibling;
                if (input.type === 'password') {
                    input.type = 'text';
                    this.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    this.classList.replace('fa-eye-slash', 'fa-eye');
                }
            });
        });

        // Handle the new form submission
        forgotForm.onsubmit = async (e) => {
            e.preventDefault();

            const code = document.getElementById('resetCode').value;
            const newPassword = document.getElementById('newPassword').value;
            const resetBtn = forgotForm.querySelector('.login-btn');

            let errorEl = document.getElementById('form-error');
            if (errorEl) errorEl.remove();

            resetBtn.disabled = true;
            resetBtn.textContent = 'Resetting...';

            try {
                const response = await fetch(`${API_BASE_URL}/v1/auth/password-reset`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, code, newPassword })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to reset password');
                }

                // Success
                formHeader.innerHTML = `
                    <div style="text-align: center; color: #4cd964; font-size: 50px; margin: 20px 0;">
                        <i class="fa-regular fa-circle-check"></i>
                    </div>
                    <h1 style="text-align: center;">Password Reset!</h1>
                    <p style="text-align: center;">Redirecting you to sign in...</p>
                `;
                forgotForm.style.display = 'none';

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                showError(error.message);
                resetBtn.disabled = false;
                resetBtn.textContent = 'Reset Password';
            }
        };
    }

    function showError(message) {
        let errorEl = document.getElementById('form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'form-error';
            errorEl.style.marginTop = '15px';
            errorEl.style.textAlign = 'center';
            forgotForm.appendChild(errorEl);
        }
        errorEl.innerHTML = `<p style="color: #ff3b30; font-size: 14px; margin-bottom: 5px;">${message}</p>`;
    }
});

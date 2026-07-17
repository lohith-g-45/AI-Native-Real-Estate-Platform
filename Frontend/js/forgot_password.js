document.addEventListener('DOMContentLoaded', () => {
    const forgotForm = document.getElementById('forgotForm');
    
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
            const response = await fetch('http://localhost:3000/v1/auth/password-reset/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link');
            }

            // Show success message
            const formHeader = document.getElementById('form-header');
            formHeader.innerHTML = `
                <div style="text-align: center; color: #4cd964; font-size: 50px; margin: 20px 0;">
                    <i class="fa-regular fa-circle-check"></i>
                </div>
                <h1 style="text-align: center;">Check Your Email</h1>
                <p style="text-align: center;">We've sent a password reset link to <strong>${email}</strong>.</p>
            `;
            forgotForm.style.display = 'none';

        } catch (error) {
            showError(error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Reset Link';
        }
    });

    function showError(message) {
        let errorEl = document.getElementById('form-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.id = 'form-error';
            errorEl.style.marginTop = '15px';
            errorEl.style.textAlign = 'center';
            forgotForm.appendChild(errorEl);
        }

        errorEl.innerHTML = `
            <p style="color: #ff3b30; font-size: 14px; margin-bottom: 5px;">${message}</p>
        `;
    }
});

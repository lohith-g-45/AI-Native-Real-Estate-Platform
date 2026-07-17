document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');
    const toggleIcons = document.querySelectorAll('.toggle-password');
    const formError = document.getElementById('formError');
    const formSuccess = document.getElementById('formSuccess');

    // Extract token from URL (e.g. reset_password.html?token=123456)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        formError.textContent = 'Invalid or missing reset token in the URL. Please click the link from your email.';
        formError.style.display = 'block';
        resetForm.querySelector('.login-btn').disabled = true;
        resetForm.querySelector('.login-btn').style.opacity = '0.5';
    }

    // Toggle Password Visibility
    toggleIcons.forEach(icon => {
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

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        formError.style.display = 'none';
        formSuccess.style.display = 'none';

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            formError.textContent = 'Passwords do not match.';
            formError.style.display = 'block';
            return;
        }

        const btn = resetForm.querySelector('.login-btn');
        btn.disabled = true;
        btn.textContent = 'Resetting...';

        try {
            const response = await fetch('http://localhost:3000/v1/auth/password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Password reset failed');
            }

            formSuccess.textContent = 'Password reset successfully! Redirecting to login...';
            formSuccess.style.display = 'block';

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } catch (error) {
            formError.textContent = error.message;
            formError.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Reset Password';
        }
    });
});

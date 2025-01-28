document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();  // Prevent form from submitting the default way

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
        showError('All fields are required!');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match!');
        return;
    }

    const payload = { name, email, password };

    try {
        const response = await fetch('http://localhost:3000/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.status === 201) {
            showSuccess('Sign-Up successful! Redirecting...');
            setTimeout(() => window.location.href = '/Sign-In/sign-in.html', 2000);  // Redirect to Sign-In page
        } else {
            showError(data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error:', error);
        showError(`Server error: ${error.message || 'Please try again later'}`);
    }
});

function showError(message) {
    const errorMessageElement = document.querySelector('.error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.color = 'red';
}

function showSuccess(message) {
    const successMessageElement = document.querySelector('.success-message');
    successMessageElement.textContent = message;
    successMessageElement.style.color = 'green';
}

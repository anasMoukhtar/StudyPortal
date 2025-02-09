document.getElementById('sign-in-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok) {
            errorMessage.textContent = result.message;
            errorMessage.style.color = 'green';
            window.location.href = '/DashBoard';  // Redirect after successful login
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        errorMessage.textContent = 'An error occurred. Please try again later.';
        errorMessage.style.color = 'red';
    }
});

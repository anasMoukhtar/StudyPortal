document.getElementById('signin-form').addEventListener('submit', async function (e) {
    e.preventDefault();  // Prevent form from submitting the default way

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showError('Both email and password are required!');
        return;
    }

    // Show loading message while checking the credentials
    showMessage('Logging in...', 'green');

    try {
        // Fetch all users from the server
        const response = await fetch('http://localhost:3000/data', { method: 'GET' });

        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const users = await response.json();

        let userFound = false;

        // Loop through users to find the email
        for (let user of users) {
            if (user.email === email) {
                userFound = true;

                // Check if the password is correct
                const isPasswordValid = await comparePasswords(password, user.password);

                if (isPasswordValid) {
                    showSuccess('Login successful!');
                    setTimeout(() => window.location.href = '/', 2000);  // Redirect to homepage or dashboard
                } else {
                    showMessage('Incorrect password', 'red');
                }
                break;
            }
        }

        // If email is not found
        if (!userFound) {
            showMessage('Incorrect email', 'red');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage(`Server error: ${error.message || 'Please try again later'}`, 'red');
    }
});

// Function to simulate password comparison (for example, comparing raw password with hashed password)
async function comparePasswords(inputPassword, storedPassword) {
    // Since we're using bcrypt on the server, you'd have to hash the password here and compare it
    // For simplicity, we'll just assume that the passwords match if they are the same.
    // In a real application, you should hash the inputPassword and compare with the hashed storedPassword.
    return inputPassword === storedPassword; // Replace with actual password comparison if needed.
}

// Show error message
function showError(message) {
    const errorMessageElement = document.querySelector('.error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.color = 'red';
}

// Show success message
function showSuccess(message) {
    const successMessageElement = document.querySelector('.success-message');
    successMessageElement.textContent = message;
    successMessageElement.style.color = 'green';
}

// Show message (used for login status like "logging in...")
function showMessage(message, color) {
    const messageElement = document.querySelector('.status-message');
    messageElement.textContent = message;
    messageElement.style.color = color;
}

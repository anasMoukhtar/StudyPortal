console.log('sign-up.js loaded'); // Confirm script is loaded
// Add event listener to the form
document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();  // Prevent form from submitting the default way
    console.log('Form submission intercepted'); // Debugging statement

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Log form data
    console.log('Form Data:', { name, email, password, confirmPassword });

    // Validate all fields are filled
    if (!name || !email || !password || !confirmPassword) {
        console.log('Validation failed: All fields are required!'); // Debugging statement
        showError('All fields are required!');
        return;
    } else {
        console.log('All fields are filled'); // Debugging statement
    }

    // Validate email format
    if (!isValidEmail(email)) {
        console.log('Validation failed: Invalid email format'); // Debugging statement
        showError('Please enter a valid email address.');
        return;
    } else {
        console.log('Email is valid'); // Debugging statement
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
        console.log('Validation failed: Password must be at least 8 characters long'); // Debugging statement
        showError('Password must be at least 8 characters long.');
        return;
    } else {
        console.log('Password is valid'); // Debugging statement
    }

    // Validate password and confirm password match
    if (password !== confirmPassword) {
        console.log('Validation failed: Passwords do not match'); // Debugging statement
        showError('Passwords do not match!');
        return;
    } else {
        console.log('Passwords match'); // Debugging statement
    }

    // If all validation passes, proceed to fetch request
    console.log('All validation passed, proceeding to fetch request'); // Debugging statement

    // Prepare payload for the request
    const payload = { name, email, password };
    console.log('Sending Data:', payload); // Debugging statement

    try {
        console.log('Making fetch request to /sign-up'); // Debugging statement
        const response = await fetch('/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status); // Debugging statement
        console.log('Response received:', response); // Debugging statement

        // Check if the response is OK
        if (!response.ok) {
            console.error('Response not OK:', response.statusText); // Debugging statement
            throw new Error('Network response was not OK');
        }

        // Parse the response data
        const data = await response.json();
        console.log('Response data:', data); // Debugging statement

        // Handle successful response
        if (response.ok) {
            showSuccess('Sign-Up successful! Redirecting...');
            setTimeout(() => window.location.href = '/Login', 2000);  // Redirect to Login
        } else {
            showError(data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Error during fetch:', error); // Debugging statement
        console.error('Error details:', error.message, error.stack); // Debugging statement
        showError(`Server error: ${error.message || 'Please try again later'}`);
    }
});

// Function to display error messages
function showError(message) {
    const errorMessageElement = document.querySelector('.error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.color = 'red';
    clearMessages();  // Clear previous messages
}

// Function to display success messages
function showSuccess(message) {
    const successMessageElement = document.querySelector('.success-message');
    successMessageElement.textContent = message;
    successMessageElement.style.color = 'green';
    clearMessages();  // Clear previous messages
}

// Function to clear messages after 5 seconds
function clearMessages() {
    setTimeout(() => {
        document.querySelector('.error-message').textContent = '';
        document.querySelector('.success-message').textContent = '';
    }, 5000);  // Clears messages after 5 seconds
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const isValid = emailRegex.test(email);
    console.log(`Email validation result for ${email}:`, isValid); // Debugging statement
    return isValid;
}
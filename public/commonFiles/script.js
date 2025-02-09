//sign in , sign up buttons 
document.addEventListener('DOMContentLoaded', () => {
    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');

    // When Sign Up button is clicked, redirect to the sign-up page
    signUpButton.addEventListener('click', () => {
        window.location.href = '/Register';  // Assuming '/Register' is your sign-up page
    });

    // When Sign In button is clicked, redirect to the sign-in page
    signInButton.addEventListener('click', () => {
        window.location.href = '/Login';  
    });
});

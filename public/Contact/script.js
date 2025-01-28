document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    console.log('Submitting:', { name, email, message }); // Debugging

    const messageResult = document.getElementById('message-result'); // Feedback div

    if (!name || !email || !message) {
        console.log('Validation failed: All fields are required!');
        messageResult.style.display = 'block';
        messageResult.textContent = 'All fields are required!';
        messageResult.className = 'message-result red';
        return;
    }

    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            console.log('Message submitted successfully');
            messageResult.style.display = 'block';
            messageResult.textContent = 'Your message has been sent successfully!';
            messageResult.className = 'message-result green';
            document.getElementById('contact-form').reset();
        } else {
            console.log('Server error occurred:', response.statusText);
            const data = await response.json();
            messageResult.style.display = 'block';
            messageResult.textContent = data.message || 'Failed to send your message. Try again later.';
            messageResult.className = 'message-result red';
        }
    } catch (error) {
        console.error('Error:', error);
        messageResult.style.display = 'block';
        messageResult.textContent = 'An error occurred. Please try again later.';
        messageResult.className = 'message-result red';
    }
});

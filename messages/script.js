async function loadMessages() {
    try {
        const response = await fetch('/api/messages'); // Make an API call to get messages in JSON format
        const data = await response.json();
        
        const messagesContainer = document.getElementById('messages');
        
        // Loop through messages and create HTML for each one
        data.messages.forEach(message => {
            const messageCard = document.createElement('div');
            messageCard.classList.add('message-card');
            
            messageCard.innerHTML = `
                <h2>${message.name}</h2>
                <p><strong>Email:</strong> ${message.email}</p>
                <p><strong>Message:</strong> ${message.message}</p>
                <p><strong>Date:</strong> ${new Date(message.createdAt).toLocaleString()}</p>
            `;
            
            messagesContainer.appendChild(messageCard);
        });
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

// Call the loadMessages function when the page is loaded
window.onload = loadMessages;
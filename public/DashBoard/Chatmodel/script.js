document.addEventListener("DOMContentLoaded", () => {
    // Define required DOM elements
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatOutput = document.getElementById("chat-output"); // Define chatOutput here
    const imgInput = document.getElementById("img-input");
    const loadingIndicator = document.getElementById("loading-indicator");
    const token = localStorage.getItem("token");
    // Check if required elements exist
    if (!chatForm || !chatInput || !chatOutput || !imgInput || !loadingIndicator) {
        console.error("Required elements not found in the HTML.");
        return;
    }

// Function to unescape HTML entities (excluding HTML tags)
// Function to escape HTML content
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Define appendMessage
function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender === "AI" ? "ai-message" : "user-message");

    // Check if the message contains a code block (between ```)
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const codeMatches = [...message.matchAll(codeBlockRegex)];

    if (codeMatches.length > 0) {
        let formattedMessage = message;

        codeMatches.forEach((match) => {
            const language = match[1] || "text"; // Extract the language (e.g., python, javascript)
            const code = match[2].trim(); // Extract the code content

            // Escape the code content
            const escapedCode = escapeHtml(code);

            // Create the code block with a copy button and language name
            const codeBlock = `
                <div class="code-block">
                    <div class="code-header">
                        <span class="language">${language}</span>
                        <button class="copy-button" onclick="copyCode(this)">Copy</button>
                    </div>
                    <pre><code class="hljs ${language}">${escapedCode}</code></pre>
                </div>
            `;

            // Replace the code block in the message with the styled code block
            formattedMessage = formattedMessage.replace(match[0], codeBlock);
        });

        // Set the inner HTML of the message element
        messageElement.innerHTML = formattedMessage;

        // Apply syntax highlighting to all code blocks using highlightElement
        messageElement.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block); // Updated method
        });
    } else {
        // If no code block, just display the plain text (unescaped)
        messageElement.textContent = message;
    }

    chatOutput.appendChild(messageElement);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll to latest message
}
// Define loadChatHistory
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach((entry) => {
        // Display messages without prefixes
        appendMessage("You", entry.user.replace("User: ", ""));
        appendMessage("AI", entry.ai.replace("AI: ", ""));
    });
}
function copyCode(button) {
    const codeBlock = button.closest(".code-block").querySelector("pre code");

    navigator.clipboard.writeText(codeBlock.textContent)
        .then(() => {
            button.textContent = "Copied!";
            setTimeout(() => {
                button.textContent = "Copy"; 
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy code:", err);
            button.textContent = "Failed to copy"; 
        });
}
window.copyCode = copyCode
// Define loadChatHistory
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach((entry) => {
        // Unescape HTML entities before displaying messages (excluding HTML tags)
        const userMessage = entry.user.replace("User: ", "");
        const aiMessage = entry.ai.replace("AI: ", "");

        // Display messages without prefixes
        appendMessage("You", userMessage);
        appendMessage("AI", aiMessage);
    });
}
// Define loadChatHistory
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach((entry) => {
        // Unescape HTML entities before displaying messages (excluding code blocks)
        const userMessage = entry.user.replace("User: ", "");
        const aiMessage = entry.ai.replace("AI: ", "");

        // Display messages without prefixes
        appendMessage("You", userMessage);
        appendMessage("AI", aiMessage);
    });
}
    // Define loadChatHistory
    function loadChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.forEach((entry) => {
            appendMessage("You", entry.user); // Load user messages
            appendMessage("AI", entry.ai); // Load AI messages
        });
    }

    // Define sendMessage
// Define appendLoadingIndicator
function appendLoadingIndicator() {
    const loadingElement = document.createElement("div");
    loadingElement.classList.add("message", "loading-message");
    loadingElement.innerHTML = `
        <div class="loading-text">AI is typing</div>
        <div class="loading-dots">
            <span>.</span><span>.</span><span>.</span>
        </div>
    `;
    chatOutput.appendChild(loadingElement);
    chatOutput.scrollTop = chatOutput.scrollHeight; // Auto-scroll to latest message
    return loadingElement; // Return the element so it can be removed later
}

// Define removeLoadingIndicator
function removeLoadingIndicator(loadingElement) {
    if (loadingElement) {
        loadingElement.remove(); // Remove the loading indicator from the chat
    }
}

// Define saveMessage
function saveMessage(userMessage, aiReply) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    if (chatHistory.length >= 30) {
        chatHistory.shift(); // Keep only the last 10 messages
    }

    // Save messages with prefixes
    chatHistory.push({ user: `User: ${userMessage}`, ai: `AI: ${aiReply}` });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// Function to unescape HTML entities
function unescapeHtml(escaped) {
    return escaped
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

// Define loadChatHistory
function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach((entry) => {
        // Unescape HTML entities before displaying messages
        const userMessage = unescapeHtml(entry.user.replace("User: ", ""));
        const aiMessage = unescapeHtml(entry.ai.replace("AI: ", ""));

        // Display messages without prefixes
        appendMessage("You", userMessage);
        appendMessage("AI", aiMessage);
    });
}
// Define sendMessage
async function sendMessage(userMessage) {
    // Append user message (without prefix)
    appendMessage("You", userMessage);
    chatInput.value = ""; // Clear the input field

    // Append loading indicator
    const loadingElement = appendLoadingIndicator();

    // Get chat history from localStorage
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    // Format chat history for the API request (with prefixes)
    const formattedHistory = chatHistory
        .map((entry) => `${entry.user}\n${entry.ai}`)
        .join("\n");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                oldChat: formattedHistory, 
                newChat: userMessage
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        const aiReply = data.choices?.[0]?.message?.content || "No response.";

        // Remove loading indicator
        removeLoadingIndicator(loadingElement);

        // Append AI message with typing effect (without prefix)
        appendMessageWithTypingEffect("AI", aiReply);

        // Save the conversation to localStorage (with prefixes)
        saveMessage(userMessage, aiReply);
    } catch (error) {
        console.error("Error fetching AI response:", error);
        removeLoadingIndicator(loadingElement); // Remove loading indicator on error
        appendMessage("AI", "Server is busy");
    }
}
    // Define appendMessageWithTypingEffect
    function appendMessageWithTypingEffect(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "AI" ? "ai-message" : "user-message");
        chatOutput.appendChild(messageElement);
    
        // 1. No initial code block div creation
    
        // 2. Typing effect (character by character)
        let index = 0;
        const chars = message.split('');
        let codeBlockDiv = null; // Initialize codeBlockDiv here
        let codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        let codeMatches = [...message.matchAll(codeBlockRegex)];
        let codeMatchIndex = 0; // To keep track of current code block
    
        function typeNextChar() {
            if (index < chars.length) {
                const char = chars[index];
    
                // If it's a code block start
                if (char === '`' && message.substring(index, index + 3) === '```') {
                    // Create a new codeBlockDiv for each code block
                    codeBlockDiv = document.createElement('div');
                    codeBlockDiv.classList.add('code-block');
                    messageElement.appendChild(codeBlockDiv); // Append the div
    
                    index += 3; // Skip the '```'
                    const codeBlockEndIndex = message.indexOf('```', index);
                    const codeContent = message.substring(index, codeBlockEndIndex);
                    index = codeBlockEndIndex + 3; // Move index to the end of the code block
    
                    // Format the code block
                    const language = codeMatches[codeMatchIndex][1] || "text";
                    const escapedCode = escapeHtml(codeContent.trim());
                    codeBlockDiv.innerHTML = `
                        <div class="code-header">
                            <span class="language">${language}</span>
                            <button class="copy-button" onclick="copyCode(this)">Copy</button>
                        </div>
                        <pre><code class="hljs ${language}">${escapedCode}</code></pre>
                    `;
    
                    // Apply syntax highlighting
                    hljs.highlightElement(codeBlockDiv.querySelector("pre code"));
    
                    codeMatchIndex++; // Move to the next code block match
                } else {
                    // Otherwise, append the character as a text node
                    const textNode = document.createTextNode(char);
                    messageElement.appendChild(textNode);
                    index++;
                }
    
                chatOutput.scrollTop = chatOutput.scrollHeight;
                setTimeout(typeNextChar, 20); // Adjust typing speed
            }
        }
    
        typeNextChar();
    }
    // Define saveMessage
    function saveMessage(userMessage, aiReply) {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

        if (chatHistory.length >= 10) {
            chatHistory.shift(); // Keep only the last 10 messages
        }

        chatHistory.push({ user: userMessage, ai: aiReply });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }

    // Define handleFormSubmit
    function handleFormSubmit(event) {
        event.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            alert("Please enter a message.");
            return;
        }

        sendMessage(userMessage);
    }

    // Load chat history on page load
    loadChatHistory();

    // Event listener for form submission
    chatForm.addEventListener("submit", handleFormSubmit);

    // Allow pressing "Enter" to send messages
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleFormSubmit(event);
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatOutput = document.getElementById("chat-output");
    const loadingIndicator = document.getElementById("loading-indicator");
    const token = localStorage.getItem("token");
    if (!chatForm || !chatInput || !chatOutput || !loadingIndicator) {
        console.error("Required elements not found in the HTML.");
        return;
    }
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    function unescapeHtml(escaped) {
        return escaped
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
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
    window.copyCode = copyCode;
    function appendMessage(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "AI" ? "ai-message" : "user-message");
        messageElement.innerHTML = marked.parse(message);
        messageElement.querySelectorAll("pre code").forEach((codeBlock) => {
            hljs.highlightElement(codeBlock);
            const codeHeader = document.createElement('div');
            codeHeader.classList.add('code-header');
            let language = "text";
            if (codeBlock.className.startsWith("language-")) {
                language = codeBlock.className.substring("language-".length).split(' ')[0];
            }
            const languageSpan = document.createElement('span');
            languageSpan.classList.add('language');
            languageSpan.textContent = language;
            codeHeader.appendChild(languageSpan);
            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button');
            copyButton.textContent = 'Copy';
            copyButton.onclick = function () { copyCode(this); };
            codeHeader.appendChild(copyButton);
            codeBlock.parentNode.insertBefore(codeHeader, codeBlock);
            codeBlock.parentNode.classList.add('code-block');
        });
        chatOutput.appendChild(messageElement);
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }
    function appendMessageWithTypingEffect(sender, message) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "AI" ? "ai-message" : "user-message");
        chatOutput.appendChild(messageElement);
        let index = 0;
        const chars = message.split('');
        let tempMessage = "";
        function typeNextChar() {
            if (index < chars.length) {
                tempMessage += chars[index];
                messageElement.innerHTML = marked.parse(tempMessage);
                messageElement.querySelectorAll("pre code").forEach((codeBlock) => {
                    hljs.highlightElement(codeBlock);
                    if (!codeBlock.parentNode.previousElementSibling?.classList?.contains('code-header')) {
                        const codeHeader = document.createElement('div');
                        codeHeader.classList.add('code-header');
                        let language = "text";
                        if (codeBlock.className.startsWith("language-")) {
                            language = codeBlock.className.substring("language-".length).split(' ')[0];
                        }
                        const languageSpan = document.createElement('span');
                        languageSpan.classList.add('language');
                        languageSpan.textContent = language;
                        codeHeader.appendChild(languageSpan);
                        const copyButton = document.createElement('button');
                        copyButton.classList.add('copy-button');
                        copyButton.textContent = 'Copy';
                        copyButton.onclick = function () { copyCode(this); };
                        codeHeader.appendChild(copyButton);
                        codeBlock.parentNode.insertBefore(codeHeader, codeBlock);
                        codeBlock.parentNode.classList.add('code-block');
                    }
                });
                index++;
                setTimeout(typeNextChar, 10);
            } else {
                messageElement.querySelectorAll("pre code").forEach((codeBlock) => {
                    hljs.highlightElement(codeBlock);
                    if (!codeBlock.parentNode.previousElementSibling?.classList?.contains('code-header')) {
                        const codeHeader = document.createElement('div');
                        codeHeader.classList.add('code-header');
                        let language = "text";
                        if (codeBlock.className.startsWith("language-")) {
                            language = codeBlock.className.substring("language-".length).split(' ')[0];
                        }
                        const languageSpan = document.createElement('span');
                        languageSpan.classList.add('language');
                        languageSpan.textContent = language;
                        codeHeader.appendChild(languageSpan);
                        const copyButton = document.createElement('button');
                        copyButton.classList.add('copy-button');
                        copyButton.textContent = 'Copy';
                        copyButton.onclick = function () { copyCode(this); };
                        codeHeader.appendChild(copyButton);
                        codeBlock.parentNode.classList.add('code-block');
                    }
                });
            }
        }
        typeNextChar();
    }
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
        chatOutput.scrollTop = chatOutput.scrollHeight;
        return loadingElement;
    }
    function removeLoadingIndicator(loadingElement) {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
    function saveMessage(userMessage, aiReply) {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        if (chatHistory.length >= 30) {
            chatHistory.shift();
        }
        chatHistory.push({ user: `User: ${userMessage}`, ai: `AI: ${aiReply}` });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    }
    function loadChatHistory() {
        let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        chatHistory.forEach((entry) => {
            const userMessage = unescapeHtml(entry.user.replace("User: ", ""));
            const aiMessage = unescapeHtml(entry.ai.replace("AI: ", ""));
            appendMessage("You", userMessage);
            appendMessage("AI", aiMessage);
        });
    }
    async function sendMessage(userMessage, imageUrl = null) {
        if (getImageData()) {
            imageUrl = getImageData();
        }
        appendMessage("You", userMessage);
        chatInput.value = "";
        const loadingElement = appendLoadingIndicator();
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
        const formattedHistory = chatHistory
            .map((entry) => `<span class="math-inline">\{entry\.user\}\\n</span>{entry.ai}`)
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
                    newChat: userMessage,
                    imageUrl: imageUrl,
                    doc: doc || null
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }
            const data = await response.json();
            const aiReply = data.choices?.[0]?.message?.content || "No response.";
            removeLoadingIndicator(loadingElement);
            appendMessageWithTypingEffect("AI", aiReply);
            saveMessage(userMessage, aiReply);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            removeLoadingIndicator(loadingElement);
            appendMessage("AI", "Sorry, I encountered an error. Please try again later.");
        }
    }
    function handleFormSubmit(event) {
        event.preventDefault();
        const userMessage = chatInput.value.trim();
        if (!userMessage && !getImageData()) {
            alert("Please enter a message or select an image.");
            return;
        }
        sendMessage(userMessage, getImageData());
        resetImageState();
    }
    loadChatHistory();
    chatForm.addEventListener("submit", handleFormSubmit);
    chatInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleFormSubmit(event);
        }
    });
});
//clear Chat History 
const clearChatHistory = () =>{
    localStorage.removeItem("chatHistory");
    showToast("chat History cleared ✅")
}
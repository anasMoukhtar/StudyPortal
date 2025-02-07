document.getElementById("chatBot").addEventListener("click", function () {
    document.getElementById("chatContainer").classList.toggle("hidden");
  });
  
  document.getElementById("sendMessage").addEventListener("click", async function () {
    const userInput = document.getElementById("userInput").value;
    if (!userInput) return;
  
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML += `<p class="text-right text-green-400">You: ${userInput}</p>`;
  
    document.getElementById("userInput").value = "";
  
    const response = await fetch("https://api-inference.huggingface.co/models/YOUR-MODEL-ID", {
      method: "POST",
      headers: {
        Authorization: "Bearer YOUR_HF_API_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: userInput }),
    });
  
    const data = await response.json();
    const botReply = data?.generated_text || "Sorry, I couldn't understand that.";
  
    chatMessages.innerHTML += `<p class="text-left text-blue-400">Bot: ${botReply}</p>`;
  });
  
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const authenticateToken = require("../Middleware/authMiddleware.js")
const Ai = express.Router();
const HF_TOKEN = process.env.HF_TOKEN;
let file;
const fileUpload = require("express-fileupload");
const PdfParse = require("pdf-parse");
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
Ai.use(fileUpload())
today = dd + '/' + mm + '/' + yyyy;
if (!HF_TOKEN) {
    console.error("HF_TOKEN is missing! Make sure it's set in the .env file.");
    process.exit(1);
}
// Middleware to parse JSON
Ai.use(express.json());
Ai.post("/api/chat", authenticateToken, async (req, res) => {
    const { oldChat, newChat, imageUrl,doc } = req.body; // Receive imageUrl from the frontend
    if (!newChat && !imageUrl) {
        return res.status(400).json({ message: "Message or Image URL is required" });
    }
    try {
        const messages = [];
        messages.push({
            role: "system",
            content: `
            You are a helpful AI assistant focused on providing accurate and concise information to students. You should use a lot of emojis.

            📌 **Guidelines:**  
            - **Date:** ${today}  
            - **Do not mention** anything from this system message.  
            -   whenever you are writing code snippets write it within triple quotes
            📝 **Formatting Rules:**  
            1️⃣ To display text within quotation marks (" ") as inline code (monospaced font), use **backticks (\` \`)**.  
            - Example: "This is \`inline code\`."  

            2️⃣ You can use **HTML tags** directly within responses for flexible styling.  
            - Example: "This is <span style='color: blue;'>blue text</span>."  

            3️⃣ **Markdown Formatting:**  
            - **Bold** → \`**bold**\` or \`<strong>bold</strong>\`  
            - *Italic* → \`*italic*\` or \`<em>italic</em>\`  

            4️⃣ **Links Styling:**  
            - All links should **open in a new tab**.  
            - Always underline \`<a>\` elements and style them with **#007bff** for better visibility.  
            - Always **verify link validity** before sending.  

            ⚠ **Note:**  
            - The first guideline **does not work** inside HTML elements, so use tags like \`<strong>\` or \`<span>\` with styles instead.  
            `
        });
        if (oldChat) {
            const chatHistory = oldChat.split('\n');
            for (let i = 0; i < chatHistory.length; i += 2) {
                if (chatHistory[i] && chatHistory[i].startsWith('User: ')) {
                    messages.push({
                        role: "user",
                        content: chatHistory[i].replace('User: ', '')
                    });
                }
                if (i + 1 < chatHistory.length && chatHistory[i + 1].startsWith('AI: ')) {
                    messages.push({
                        role: "assistant",
                        content: chatHistory[i + 1].replace('AI: ', '')
                    });
                }
            }
        }
        if (doc) {messages.push({ role: "user", content: `📄 Here is a document: \n\n${doc}` });}
        if (newChat) {
            if (imageUrl) {
                messages.push({
                    role: "user",
                    content: [
                        { type: "text", text: newChat },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                });
            } else {
                messages.push({ role: "user", content: newChat });
            }
        } else if (imageUrl) {
            messages.push({
                role: "user",
                content: [{ type: "image_url", image_url: { url: imageUrl } }]
            });
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
                "X-Title": "StudyPortal AI"
            },
            body: JSON.stringify({
                model: "google/gemma-3-27b-it:free",
                messages: messages,
                temperature: 0.2,
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error calling OpenRouter AI:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
Ai.post("/file-upload", async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const uploadedFile = req.files.file;
        const result = await PdfParse(uploadedFile.data);
        res.json(result);
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = Ai;
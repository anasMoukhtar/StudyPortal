const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const authenticateToken = require("../Middleware/authMiddleware.js")
const Ai = express.Router();
const HF_TOKEN = process.env.HF_TOKEN;

if (!HF_TOKEN) {
    console.error("HF_TOKEN is missing! Make sure it's set in the .env file.");
    process.exit(1);
}

// Middleware to parse JSON
Ai.use(express.json());
Ai.post("/api/chat",authenticateToken, async (req, res) => {
    const { oldChat, newChat } = req.body;
    if (!newChat) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
                "X-title":"StudyPortal Ai"
            },
            body: JSON.stringify({
                model: "mistralai/mistral-7b-instruct:free",
                messages: [{ role: "user", content: `old chat: ${oldChat}, user: ${newChat}` },{ role: "system", content:"I want"}]
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

module.exports = Ai;
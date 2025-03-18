const express = require("express");
const jwt = require("jsonwebtoken");
const client = require("../model/clients");
const router = express.Router();

// 📌 Upload & Save Profile Picture (Base64)
router.post("/Upload", async (req, res) => {
    try {
        const base64Image = req.body.pfp; // Base64 image from frontend
        const jwtToken = req.cookies.refreshToken; // JWT from cookies

        if (!jwtToken) {
            return res.status(401).json({ message: "No token found" });
        }

        // Verify JWT using the REFRESH_TOKEN_SECRET since we're checking a refresh token
        const decoded = jwt.verify(jwtToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;

        // Update profile picture in MongoDB
        const updatedClient = await client.findOneAndUpdate(
            { _id: userId },
            { $set: { pfp: base64Image } }, // Store Base64 image
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile picture updated" });

    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// 📌 Fetch Profile Picture (Base64)
router.get("/Upload", async (req, res) => {
    try {
        const jwtToken = req.cookies.refreshToken; 
        if (!jwtToken) {
            return res.status(401).json({ message: "No token found" });
        }

        // Verify JWT using the REFRESH_TOKEN_SECRET
        const decoded = jwt.verify(jwtToken, process.env.REFRESH_TOKEN_SECRET);
        const userId = decoded.userId;
        const clientData = await client.findById(userId);

        if (clientData) {
            res.status(200).json({ pfp: clientData.pfp });
        } else {
            return res.status(404).json({ message: "User not found" });
        }

    } catch (err) {
        console.error("Error verifying JWT:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
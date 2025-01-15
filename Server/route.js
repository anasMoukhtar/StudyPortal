const express = require('express');
const router = express.Router();
const Client = require('./model/clients');
const bcrypt = require('bcrypt');
const path = require('path'); // Add this line to import the path module

// GET /data
router.get('/data', async (req, res) => {
    try {
        const data = await Client.find();
        res.json(data);
    } catch (err) {
        console.error('Error in /data route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /data (Sign-Up & Sign-In)
router.post('/data', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required!' });
        }

        // Sign-Up: Handle creating a new user
        if (name && email && password) {
            const existingUser = await Client.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const client = new Client({ name, email, password: hashedPassword });
            await client.save();

            return res.status(201).json({ message: 'Account created successfully!' });
        }

        // Sign-In: Handle user authentication
        if (email && password) {
            const client = await Client.findOne({ email });
            if (!client) {
                return res.status(404).json({ message: 'Incorrect email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, client.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Incorrect email or password' });
            }

            return res.status(200).json({ message: 'Login successful' });
        }

        return res.status(400).json({ message: 'All fields are required!' });
    } catch (err) {
        console.error('Error in /data route:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve HTML pages
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../HomePage/index.html'));
});

router.get('/Pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '/../Pricing/pricing.html'));
});

router.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '/../signUp/sign-Up.html'));
});

router.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '/../signIn/sign-in.html'));
});

module.exports = router;
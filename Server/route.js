const express = require('express');
const router = express.Router();
const Client = require('./model/clients');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const app = express(); // Define app here

// POST /sign-up: Handle Sign-Up requests
router.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required!' });
    }

    try {
        const existingUser = await Client.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({ name, email, password: hashedPassword });
        await newClient.save();

        res.status(201).json({ message: 'Account created successfully!' });
    } catch (err) {
        console.error('Error during sign-up:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /sign-in: Handle Sign-In requests
router.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required!' });
    }

    try {
        const client = await Client.findOne({ email });

        if (!client) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, client.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /data - Retrieve all clients (just for testing or admin purposes)
router.get('/data', async (req, res) => {
    try {
        const data = await Client.find();
        res.json(data);
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- HTML Page Routes ---
// Serve Home Page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../HomePage', 'index.html'));
});

router.get('/about', (req, res) => {
    const nonce = res.locals.nonce || ''; // Default to empty if not set

    // Read and render the `about.html` file
    const aboutPage = fs.readFileSync(path.join(__dirname, '../about', 'about.html'), 'utf8');
    const renderedHtml = ejs.render(aboutPage, { nonce });

    res.send(renderedHtml);
});
// Serve Pricing Page
router.get('/Pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '../Plans', 'plans.html'));
});

// Serve Sign-Up Page
router.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '../Sign-up', 'sign-up.html'));
});

// Serve Sign-In Page
router.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '../Sign-In', 'sign-in.html'));
});

// Serve Dashboard Page (after successful login)
router.get('/Dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../Dashboard', 'index.html'));
});

// Handle undefined routes (404)
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

module.exports = router;
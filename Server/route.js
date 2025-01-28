const express = require('express');
const router = express.Router();
const Client = require('./model/clients');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const Messages = require('./model/messages'); // Ensure this path is correct
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

// POST /api/messages: Handle contact form submissions
router.post('/api/messages', async (req, res) => {
    console.log('Request received:', req.body); // Log the incoming request body

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({ message: 'Name, email, and message are required!' });
    }

    try {
        const newMessage = new Messages({ name, email, message });
        await newMessage.save();
        console.log('Message saved successfully:', newMessage); // Log the saved message
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Error saving message:', err); // Log the error
        res.status(500).json({ message: 'Error saving your message.' });
    }
});

// API Route: Retrieve all messages
router.get('/api/messages', async (req, res) => {
    try {
        const messages = await Messages.find();
        res.json({ messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve static HTML pages (Home, About, Contact, etc.)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HomePage', 'index.html'));
});
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname , '../public/about' , 'about.html'));
});
router.get('/messages', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/messages', 'messages.html'));
});
router.get('/Dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Dashboard', 'index.html'));
});
router.get('/Contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Contact', 'contact.html'));
});
router.get('/Pricing', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Plans', 'plans.html'));
});
router.get('/Register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Sign-up', 'sign-up.html'));
});
router.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Sign-In', 'sign-in.html'));
});
// 404 Handler for undefined routes
router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '/error.html'));
});

module.exports = router;

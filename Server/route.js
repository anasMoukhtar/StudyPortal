const express = require('express');
const router = express.Router();
const Client = require('./model/clients');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

// POST /sign-up: Handle Sign-Up requests
router.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required!' });
    } else if (!/^[a-zA-Z]*$/.test(name)) {
        return res.status(400).json({ 
            status: 'FAILED',
            message: 'Name should only contain alphabetic characters!'
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({ 
            status: 'FAILED',
            message: 'Invalid email format!'
        });
    } else if (password.length < 8) {
        return res.status(400).json({ 
            status: 'FAILED',
            message: 'Password must be at least 8 characters long!'
        });
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

// Serve static HTML pages (Home, About, Contact, etc.)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/HomePage', 'index.html'));
});
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about', 'about.html'));
});
//Dashboard routes
router.get('/DashBoard', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Dashboard', 'index.html'));
});
router.get('/DashBoard/OverView', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Dashboard/OverView', 'overview.html'));
}
    )  
router.get('/DashBoard/Pomodoro', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/DashBoard/Pomodoro', 'pomodoro.html'));
    }
        )
router.get('/DashBoard/FlashCards', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/DashBoard/FlashCards', 'flashCards.html'));
    }
        )
router.get('/DashBoard/Ai', (req, res) => {
         res.sendFile(path.join(__dirname, '../public/DashBoard/Chatmodel', 'index.html'));
    }
        )

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
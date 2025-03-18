const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const Client = require(path.join(__dirname, '../model/clients.js'));
const authenticateToken = require(path.join(__dirname,'../Middleware/authMiddleware'));
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');

// Rate limiting for login route
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

// CSRF protection (only for form-based pages)
const csrfProtection = csrf({ cookie: true });

// Function to generate JWT token (access token)
const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, email: user.email, role: 'student' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

// Function to generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // Refresh token expires in 7 days
    );
};

// **SIGN-UP Route**
router.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required!' });
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ message: 'Name should only contain alphabetic characters and spaces!' });
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format!' });
    }

    // Simplified password validation (only checks length)
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long!' });
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
// **SIGN-IN Route**
router.post('/sign-in', loginLimiter, async (req, res) => {
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

        // Generate JWT token and refresh token
        const token = generateToken(client);
        const refreshToken = generateRefreshToken(client);

        // Set tokens as HTTP-only cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 604800000 // 7 days
        });

        res.status(200).json({ message: 'Login successful' });

    } catch (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// **REFRESH TOKEN Route**
router.post('/refresh-token', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newToken = generateToken({ _id: decoded.userId, email: decoded.email });
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: 'Token refreshed' });
    });
});

// **LOGOUT Route**
router.post('/logout', (req, res) => {
    res.clearCookie('token'); // Remove the JWT token cookie
    res.clearCookie('refreshToken'); // Remove the refresh token cookie
    res.json({ message: 'Logged out successfully' });
});

// **GET Routes for Login & Registration Pages**
router.get('/login', csrfProtection, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/Sign-In/sign-in.html'));
});
router.get('/register', csrfProtection, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/Sign-up/sign-up.html'));
});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const routes = require('./route.js');
const staticFiles = require('./staticFiles.js'); // Now an array of functions
const app = express();
const crypto = require('crypto');
const URI = process.env.MONGODBURI;
const port = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/data', limiter);

// Security Middleware (without helmet)
app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString('base64'); // Generate nonce
    next();
});

app.use(cors());
app.use(express.json());

// Serve static files
staticFiles.forEach((setupStaticFile) => setupStaticFile(app));

// MongoDB Connection
mongoose.connect(URI)
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Routes
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
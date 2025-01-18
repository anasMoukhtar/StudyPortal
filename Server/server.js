const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const routes = require('./route'); // Import the routes file
const staticFiles = require('./staticFiles'); // Import the static files middleware
require('dotenv').config();

const app = express();
const URI = process.env.MONGODBURI;
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use(cors());

// Serve static files using staticFiles.js
staticFiles(app);

// MongoDB Connection
mongoose.connect(URI)
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Use the routes defined in routes.js
app.use('/', routes);

// 404 Handler for undefined routes
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

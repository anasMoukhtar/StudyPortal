const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config({ path: require('path').join(__dirname, '/.env') });
const cors = require('cors');
const routes = require('./route'); // Import the routes file
const staticFiles = require('./staticFiles'); // Import the static files middleware

const app = express();
const URI = process.env.MONGODBURI;
const port =  3000 || process.env.PORT;
app.use(bodyParser.json());
// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
app.use(cors({
    origin: ['https://Studyportal.pro'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Serve static files using staticFiles.js
staticFiles(app);

// MongoDB Connection with improved error handling
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Retrying...');
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
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

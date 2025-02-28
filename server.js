const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');
const routes = require('./route');
const staticFiles = require('./staticFiles');
const pdfhandler = require('./module/pdfhandler');
const list = require('./model/data');
const app = express();
const URI = process.env.MONGODBURI;
const PORT = process.env.PORT || 3000;
const Client_URL = process.env.Client_URL.trim() || 'http://localhost:3000';

// Enable trust proxy
app.set('trust proxy', true);

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: Client_URL.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust based on your needs
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:"]
        }
    },
    crossOriginResourcePolicy: { policy: "same-site" }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    keyGenerator: (req) => {
        // Use X-Forwarded-For header if available
        return req.headers['x-forwarded-for'] || req.ip;
    }
});

app.use(limiter);
// Serve static files
staticFiles(app);

// MongoDB Connection with error handling
mongoose.connect(URI)
    .then(() => console.log('MongoDB connection established'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});


mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Retrying in 5 seconds...');
    setTimeout(() => mongoose.connect(URI, mongooseOptions), 5000);
});

// Routes
app.use('/', pdfhandler);
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close().then(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    }).catch((err) => {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
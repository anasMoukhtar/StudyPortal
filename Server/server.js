const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: require('path').join(__dirname, '/.env') });
const cors = require('cors');
const routes = require('./route');
const staticFiles = require('./staticFiles');
const pfp = require('./module/pfp');

const app = express();
const URI = process.env.MONGODBURI;
const PORT = process.env.PORT || 3000;
const Client_URL = process.env.Client_URL.trim() || 'http://localhost:3000';

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files
staticFiles(app);
app.use('/', pfp);

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
    console.warn('MongoDB disconnected. Retrying...');
});
// Use routes
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
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

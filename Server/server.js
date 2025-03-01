const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: require('path').join(__dirname, '/.env') });
const cors = require('cors');
const routes = require('./route');
const staticFiles = require('./staticFiles');
const pdfhandler = require('./module/pdfhandler');
const list = require('./model/data');
const app = express();
const URI = process.env.MONGODBURI;
const PORT = process.env.PORT || 3000;
const Client_URL = process.env.Client_URL.trim() || 'http://localhost:3000';
app.use(bodyParser.json());
app.use(cookieParser());
// Middleware
app.use(cors())
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
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
    console.warn('MongoDB disconnected. Retrying...');
});
app.use('/',pdfhandler)
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

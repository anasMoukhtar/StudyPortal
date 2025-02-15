const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: require('path').join(__dirname, '/.env') });
const cors = require('cors');
const routes = require('./route'); 
const staticFiles = require('./staticFiles'); 

const app = express();
const URI = process.env.MONGODBURI;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());  // Enable cookie parsing

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 

// Allow cookies to be sent from frontend
app.use(cors());

// Serve static files
staticFiles(app);

// MongoDB Connection with error handling
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

// Use routes
app.use('/', routes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

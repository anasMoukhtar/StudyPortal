const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const Client = require('./model/clients');
const cors = require('cors');
const path = require('path');

const app = express();
const URI = process.env.MONGODBURI;
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(`../`)));

// MongoDB Connection
mongoose.connect(URI)
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.error('MongoDB connection error:', err));
//get database
// GET /data - Retrieve user data
app.get('/data', async (req, res) => {
  try {
    const data = await Client.find();  // Find all users
    res.json(data);  // Send back the user data
  } catch (err) {
    console.error('Error in /data route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /data (Sign-Up & Sign-In)
app.post('/data', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Sign-Up: Handle creating a new user
    if (name && email && password) {
      const existingUser = await Client.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered!' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const client = new Client({ name, email, password: hashedPassword });
      await client.save();

      return res.status(201).json({ message: 'Account created successfully!' });
    }

    // Sign-In: Handle user authentication
    if (email && password) {
      const client = await Client.findOne({ email });
      if (!client) {
        return res.status(404).json({ message: 'Incorrect email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, client.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Incorrect email or password' });
      }

      return res.status(200).json({ message: 'Login successful' });
    }

    return res.status(400).json({ message: 'All fields are required!' });
  } catch (err) {
    console.error('Error in /data route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Welcome page (serving index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../HomePage/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

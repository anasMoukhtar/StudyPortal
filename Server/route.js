const express = require('express');
const router = express.Router();
const path = require('path');
const authenticateToken = require('./Middleware/authMiddleware');
const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const auth = require('./module/auth')
const Ai = require('./module/Ai.js')
const List = require('./model/data.js');
router.use('/', auth)
// Tasks still working on it not 100% finished
router.post('/add-list', authenticateToken, async (req, res) => {
    const { title, tasks } = req.body;
    const userEmail = req.user.email; // From the JWT token

    if (!title || !tasks || tasks.length === 0) {
        return res.status(400).json({ message: 'List title and tasks are required!' });
    }

    try {
        const newList = new List({
            userEmail,
            title,
            tasks
        });

        await newList.save();
        res.status(201).json({ message: 'List and tasks created successfully!' });
    } catch (err) {
        console.error('Error creating list:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Fetch all lists and tasks for a user
router.post('/tasks', async (req, res) => {
    try {
      const { title, details, date, completed, listId } = req.body;
      
      const newTask = new Task({
        title,
        details,
        date,
        completed,
        listId,
      });
  
      const savedTask = await newTask.save();
      res.status(201).json(savedTask); // Send back the saved task data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving task" });
    }
  });
  
// AI Chat Route
router.use('/' , Ai)

// Validate required environment variables
if (!SECRET_KEY || !REFRESH_TOKEN_SECRET) {
    console.error('JWT_SECRET or REFRESH_TOKEN_SECRET is missing in environment variables.');
    process.exit(1);
}
// **CHECK AUTH Route**
router.get('/check-auth', authenticateToken, (req, res) => {
    res.json({ authenticated: true, user: req.user });
});

// **Public Pages (CSRF Kept for Forms)**
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/about/about.html'));
});
router.get('/Plans', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Plans/plans.html'));
    console.log(__dirname)
});
router.get('/Contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Contact/contact.html'));
});
// **Dashboard (Protected Routes)**
router.get('/dashboard/tasks', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/Tasks/tasks.html'));
});
router.get('/dashboard', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/OverView/overview.html'));
});
router.get('/dashboard/pomodoro', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/Pomodoro/pomodoro.html'));
});
router.get('/dashboard/flashcards', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/FlashCards/flashCards.html'));
});
router.get('/dashboard/ai', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/Chatmodel', 'Ai.html'));
});
router.get('/dashboard/Shop', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/shop', 'shop.html'));
});
router.get('/dashboard/Doqu', authenticateToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/DashBoard/pdfs', 'Doqu.html'));
});
// **404 Handler for undefined routes**
router.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/Sign-up/sign-up.html'));
    console.log(__dirname)

});

module.exports = router;
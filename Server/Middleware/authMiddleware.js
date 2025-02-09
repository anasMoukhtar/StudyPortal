const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Ensure the token is read from cookies
    if (!token) {
        console.log("No token found. Redirecting to login.");
        return res.redirect('/login'); // Make sure to RETURN here
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/login'); 
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
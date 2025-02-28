const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Read access token from cookies

    if (!token) {
        console.log("No access token found. Checking refresh token...");
        return refreshAccessToken(req, res, next);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Access token expired. Checking refresh token...");
            return refreshAccessToken(req, res, next);
        }

        req.user = decoded; // Store user data in request
        next();
    });
};

// Function to refresh access token using refresh token
const refreshAccessToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken; // Read refresh token from cookies

    if (!refreshToken) {
        console.log("No refresh token found. Redirecting to login.");
        return res.redirect('/login');
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            console.log("Invalid refresh token. Redirecting to login.");
            return res.redirect('/login');
        }

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Access token expires in 1 hour
        );

        // Store new access token in cookies
        res.cookie('token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hour
        });

        req.user = decoded; // Attach user info to request
        next(); // Continue with the original request
    });
};

module.exports = authenticateToken;

const jwt = require('jsonwebtoken');

// Define the function to generate a token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Set token expiration time (optional)
    });
};

module.exports = generateToken;

const db = require("../config/db.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../middlewares/generateTokenAndCookies.js'); 

// Fetch countries
const fetchCountries = (req, res) => {
    db.query("SELECT country_id, country_name FROM country", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Fetch states based on selected country
const fetchStates = (req, res) => {
    const countryId = req.query.country_id;
    db.query(
        "SELECT state_id, state_name FROM states WHERE country_id = ?",
        [countryId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};

// Validate registration data
const validateRegistrationData = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Name is required";
    if (!data.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email is invalid";
    }
    if (!data.country_code) errors.country_code = "Country code is required";
    if (!data.mobile_number) {
        errors.mobile_number = "Mobile number is required";
    } else if (!/^\d{1,15}$/.test(data.mobile_number)) {
        errors.mobile_number = "Mobile number is invalid";
    }
    if (!data.gender) errors.gender = "Gender is required";
    if (!data.country_id) errors.country_id = "Country is required";
    if (!data.state_id) errors.state_id = "State is required";
    if (!data.password) {
        errors.password = "Password is required";
    } else if (data.password.length < 8 || data.password.length > 18) {
        errors.password = "Password must be between 8 to 18 characters";
    } else if (!/[A-Z]/.test(data.password)) {
        errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(data.password)) {
        errors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        errors.password = "Password must contain at least one special character";
    }

    return errors;
};

// Register user
const signupUser = async (req, res) => {
    const { user_name, user_email, user_country_code, user_mobile_number, user_gender, country_id, state_id, user_password } = req.body;

    console.log('Request Body:', req.body); // Debugging line
    console.log('User Password:', user_password); // Debugging line

    try {
        db.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            } else {
                if (!user_password) {
                    return res.status(400).json({ message: 'Password is required' }); // Validate password presence
                }
                const hashedPassword = await bcrypt.hash(user_password, 10);
                const newUser = {
                    user_name,
                    user_email,
                    user_country_code,
                    user_mobile_number,
                    user_gender,
                    country_id,
                    state_id,
                    user_password: hashedPassword,
                    user_created_at: new Date(),
                };

                db.query('INSERT INTO users SET ?', newUser, (err, result) => {
                    if (err) throw err;
                    const token = generateToken(result.insertId);
                    res.status(201).json({ token });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Validate login data
const validateLoginData = (data) => {
    const errors = {};
    if (!data.email) {
        errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "Email is invalid";
    }
    if (!data.password) {
        errors.password = "Password is required";
    }
    return errors;
};

// Login user
const loginUser = async (req, res) => {
    const { user_email, user_password } = req.body;

    try {
        db.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(user_password, user.user_password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const token = generateToken(user.user_id);
            res.json({ token });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Check if email exists
const checkEmail = (req, res) => {
    const { email } = req.body;

    try {
        db.query('SELECT * FROM users WHERE user_email = ?', [email], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                return res.status(400).json({ message: 'Email not found', exists: false });
            }

            const token = generateToken(results[0].user_id); // Use user_id instead of id
            res.json({ exists: true, token, userId: results[0].user_id });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update password
const changePassword = async (req, res) => {
    const { email, password } = req.body; // Get email and new password from request body

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('UPDATE users SET user_password = ? WHERE user_email = ?', [hashedPassword, email], (err, result) => {
            if (err) throw err;

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Failed to update password. User not found.' });
            }

            res.json({ success: true, message: 'Password updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
const getUsers = (req, res) => {
    const query = `
      SELECT 
        users.user_id, 
        users.user_name, 
        users.user_email, 
        CONCAT(users.user_country_code, ' ', users.user_mobile_number) AS contact_number, 
        users.user_gender, 
        country.country_name AS country, 
        states.state_name AS state, 
        users.user_created_at AS created_at
      FROM 
        users 
      JOIN 
        country ON users.country_id = country.country_id 
      JOIN 
        states ON users.state_id = states.state_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(results);
    });
};

module.exports = {
    fetchCountries,
    fetchStates,
    signupUser,
    loginUser,
    checkEmail,
    changePassword,
    getUsers,
};

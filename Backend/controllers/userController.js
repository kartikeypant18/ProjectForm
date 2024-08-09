const db = require("../config/db.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../middlewares/generateTokenAndCookies.js');

// Fetch all countries
const fetchCountries = (req, res) => {
    db.query(
        "SELECT country_id, country_name, country_shortname, country_phonecode FROM countries",
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};

// Fetch states based on the selected country
const fetchStates = (req, res) => {
    const countryId = req.query.country_id;
    db.query("SELECT state_id, state_name FROM states WHERE state_country_id = ?", [countryId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Register user
const signupUser = async (req, res) => {
    const { user_name, user_email, user_country_code, user_mobile_number, user_gender, state_country_id, state_id, user_password } = req.body;

    try {
        db.query('SELECT * FROM users WHERE user_email = ?', [user_email], async (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            } else {
                const hashedPassword = await bcrypt.hash(user_password, 10);
                const newUser = {
                    user_name,
                    user_email,
                    user_country_code,
                    user_mobile_number,
                    user_gender,
                    state_country_id,
                    state_id,
                    user_password: hashedPassword,
                    created_at: new Date(),
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

            const token = generateToken(results[0].user_id);
            res.json({ exists: true, token, userId: results[0].user_id });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update password
const changePassword = async (req, res) => {
    const { email, password } = req.body;

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
        countries.country_name AS country, 
        states.state_name AS state, 
        users.created_at
      FROM 
        users 
      JOIN 
        countries ON users.state_country_id = countries.country_id
      JOIN 
        states ON users.state_id = states.state_id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Delete user
const handleDelete = (req, res) => {
    const { userId } = req.params;

    db.query('DELETE FROM users WHERE user_id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    });
};

// Edit user
const editUser = (req, res) => {
    const { userId } = req.params;
    const updatedUser = req.body;

    db.query('UPDATE users SET ? WHERE user_id = ?', [updatedUser, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        res.json({ success: true, message: 'User updated successfully' });
    });
};

// Submit a contact request
const submitContactRequest = (req, res) => {
    const { name, email, phone, message } = req.body;

    const query = 'INSERT INTO contact_requests (contact_name, contact_email, contact_number, contact_message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, phone, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: 'Contact request submitted successfully' });
    });
};

// Fetch all contact requests
const fetchContactRequests = (req, res) => {
    const query = 'SELECT contact_id, contact_name, contact_email, contact_number, contact_message FROM contact_requests';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const groupedResults = results.reduce((acc, current) => {
            const { contact_email, contact_id, contact_name, contact_number, contact_message } = current;

            if (!acc[contact_email]) {
                acc[contact_email] = {
                    contact_id: contact_id,
                    contact_name: contact_name,
                    contact_email: contact_email,
                    contact_number: contact_number,
                    contact_messages: [contact_message],
                };
            } else {
                acc[contact_email].contact_messages.push(contact_message);
            }

            return acc;
        }, {});

        res.json(Object.values(groupedResults));
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
    handleDelete,
    editUser,
    submitContactRequest,
    fetchContactRequests,
};

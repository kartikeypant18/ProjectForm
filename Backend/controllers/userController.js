const db = require("../config/db.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../middlewares/generateTokenAndCookies.js');
const fs = require('fs');
const path = require('path');
const nodemailer = require("nodemailer");

const fetchCountries = (req, res) => {
    db.query(
        "SELECT country_id, country_name, country_shortname, country_phonecode FROM countries",
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
};


const fetchStates = (req, res) => {
    const countryId = req.query.country_id;
    db.query("SELECT state_id, state_name FROM states WHERE state_country_id = ?", [countryId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};


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
const sendPasswordResetEmail = async (user_email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;

        const info = await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_ADDRESS}>`,
            to: user_email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}`,
            html: `<b>You requested a password reset. Please click the following link to reset your password:</b> <a href="${resetLink}">${resetLink}</a>`,
        });

        console.log("Password reset email sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        db.query('SELECT * FROM users WHERE user_email = ?', [email], async (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                return res.status(400).json({ message: 'Email not found', exists: false });
            }

            const user = results[0];
            const resetToken = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Send password reset email
            await sendPasswordResetEmail(user.user_email, resetToken);

            res.json({ exists: true, message: 'Password reset link sent to email' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const changePassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        db.query('UPDATE users SET user_password = ? WHERE user_id = ?', [hashedPassword, userId], (err, result) => {
            if (err) throw err;

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Failed to update password. User not found.' });
            }

            res.json({ success: true, message: 'Password updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

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


const submitContactRequest = (req, res) => {
    const { name, email, phone, message } = req.body;

    const query = 'INSERT INTO contact_requests (contact_name, contact_email, contact_number, contact_message) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, phone, message], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(200).json({ message: 'Contact request submitted successfully' });
    });
};


const fetchContactRequests = (req, res) => {
    const query = `
        SELECT 
            contact_id, 
            contact_name, 
            contact_email, 
            contact_number, 
            contact_message, 
            attendance_status 
        FROM contact_requests
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching contact requests:", err.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const groupedResults = results.reduce((acc, current) => {
            const { 
                contact_id, 
                contact_name, 
                contact_email, 
                contact_number, 
                contact_message, 
                attendance_status 
            } = current;

            if (!acc[contact_email]) {
                acc[contact_email] = {
                    contact_id: contact_id,
                    contact_name: contact_name,
                    contact_email: contact_email,
                    contact_number: contact_number,
                    attendance_status: attendance_status, // Include attendance status
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




const insertEmailTemplate = (slug, title, subject, filePath) => {
    const templatePath = path.join(__dirname, '../../SigninUp/src/components/emailtemplates', filePath);

    fs.readFile(templatePath, 'utf8', (err, content) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        
        const checkQuery = "SELECT * FROM Email_templates WHERE temp_slug = ?";
        db.query(checkQuery, [slug], (err, results) => {
            if (err) {
                console.error('Error checking for existing template:', err);
                return;
            }

            if (results.length > 0) {
                
                console.log(`Template with slug '${slug}' already exists. No changes made.`);
            } else {
                
                const query = `
                    INSERT INTO Email_templates (temp_slug, temp_title, temp_subject, temp_content, temp_created_at) 
                    VALUES (?, ?, ?, ?, NOW())
                `;

                db.query(query, [slug, title, subject, content], (err, result) => {
                    if (err) {
                        console.error('Error inserting template into database:', err);
                    } else {
                        console.log(`Template ${title} inserted successfully`);
                    }
                });
            }
        });
    });
};


insertEmailTemplate('signup', 'Signup Template', 'Welcome to Our Service', 'signup.html');
insertEmailTemplate('change_password', 'Change Password Template', 'Reset Your Password', 'changePassword.html');
insertEmailTemplate('forgot_password', 'Forgot Password Template', 'Password Recovery', 'forgotPassword.html');




const fetchEmailTemplates = (req, res) => {
    const query = "SELECT temp_slug, temp_title, temp_created_at, temp_updated_at FROM Email_templates";

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
};




const fetchEmailTemplateBySlug = (req, res) => {
    const { slug } = req.params;

    const query = "SELECT temp_title, temp_content FROM Email_templates WHERE temp_slug = ?";
    db.query(query, [slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(404).json({ message: "Template not found" });
        }
        res.json(results[0]);
    });
};
const updateEmailTemplate = (req, res) => {
    const { slug } = req.params;
    const { temp_content, file_path } = req.body;

    
    const updateQuery = `
      UPDATE Email_templates 
      SET temp_content = ?, temp_updated_at = NOW() 
      WHERE temp_slug = ?
    `;

    db.query(updateQuery, [temp_content, slug], (err, result) => {
      if (err) {
        console.error('Error updating template in database:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      
      const templatePath = path.join(__dirname, '../../SigninUp/src/components/emailtemplates', file_path);

      fs.writeFile(templatePath, temp_content, 'utf8', (err) => {
        if (err) {
          console.error(`Error writing file ${file_path}:`, err);
          return res.status(500).json({ error: 'Error writing to file' });
        }

        console.log(`Template ${slug} updated successfully`);
        res.status(200).json({ message: 'Template updated successfully!' });
      });
    });
};



const sendReply = async (req, res) => {
    const { subject, reply, email } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ADDRESS, 
                pass: process.env.EMAIL_PASSWORD, 
            },
        });

        const info = await transporter.sendMail({
            from: `"Kartikey Pant" <${process.env.EMAIL_ADDRESS}>`,
            to: email,
            subject: subject,
            text: reply,
            html: `<b>${reply}</b>`,
        });

        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ message: 'Reply sent successfully', messageId: info.messageId });
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const SetNewPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Token decoded:", decoded);
        const userId = decoded.id;

        db.query('SELECT * FROM users WHERE user_id = ?', [userId], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = results[0];
            const isMatch = await bcrypt.compare(oldPassword, user.user_password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            db.query('UPDATE users SET user_password = ? WHERE user_id = ?', [hashedNewPassword, userId], (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                if (result.affectedRows === 0) {
                    return res.status(400).json({ message: 'Failed to update password' });
                }

                res.json({ success: true, message: 'Password updated successfully' });
            });
        });
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// In userController.js
const updateAttendanceStatus = (req, res) => {
    const { id } = req.params;
    const { attendance_status } = req.body;
  
    // Update the attendance status in the database
    const query = 'UPDATE contact_requests SET attendance_status = ? WHERE contact_id = ?';
    db.query(query, [attendance_status, id], (err, result) => {
      if (err) {
        return res.status(500).send('Error updating attendance status');
      }
      res.send('Attendance status updated successfully');
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
    fetchEmailTemplates,
    fetchEmailTemplateBySlug, 
    updateEmailTemplate,
    sendReply,
    SetNewPassword,
    updateAttendanceStatus
};
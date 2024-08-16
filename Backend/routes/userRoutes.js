const express = require("express");
const {
    fetchCountries, // Fetch all countries
    fetchStates, // Fetch states based on the selected country
    signupUser, // Handle user signup
    loginUser, // Handle user login
    checkEmail, // Check if an email exists in the database
    changePassword, // Change user's password
    getUsers, // Fetch all users
    handleDelete, // Handle user deletion
    editUser, // Edit user details
    submitContactRequest, // Submit a contact request
    fetchContactRequests, // Fetch all contact requests
    fetchEmailTemplates, // Fetch all email templates
    fetchEmailTemplateBySlug, // Fetch a specific email template by slug
    updateEmailTemplate, // Update an email template
    sendReply, // Send a reply to a contact request
    SetNewPassword, // Set a new password for the user
    updateAttendanceStatus, // Update the attendance status of a contact request
} = require("../controllers/userController.js");
const authenticateToken = require("../middlewares/authenticateToken.js");

const router = express.Router();

// Route to fetch all countries
router.get("/countries", fetchCountries);

// Route to fetch states based on the selected country
router.get("/states", fetchStates);

// Route for user signup
router.post("/signup", signupUser);

// Route for user login
router.post("/login", loginUser);

// Route to check if an email exists in the database
router.post("/check-email", checkEmail);

// Route to change user's password
router.post("/changepassword", changePassword);

// Route to fetch all users
router.get("/users", getUsers);

// Route to delete a user by their ID
router.delete("/delete/:userId", handleDelete);

// Route to edit user details by user ID
router.put("/users/:userId", editUser);

// Route to submit a contact request
router.post("/contact", submitContactRequest);

// Route to fetch all contact requests
router.get("/contact-requests", fetchContactRequests);

// Route to fetch all email templates
router.get("/email-templates", fetchEmailTemplates);

// Route to fetch a specific email template by slug
router.get("/email-templates/:slug", fetchEmailTemplateBySlug);

// Route to update an email template by slug
router.put("/save-email-templates/:slug", updateEmailTemplate);

// Route to send a reply to a contact request
router.post("/sendReply", sendReply);

// Route to set a new password for the user (requires authentication)
router.post("/setnewpassword", authenticateToken, SetNewPassword);

// Route to update the attendance status of a contact request by ID
router.patch("/contact-requests/:id", updateAttendanceStatus);



module.exports = router;

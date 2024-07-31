const express = require("express");
const {
    fetchCountries,
    fetchStates,
    registerStudent,
    loginStudent,
    checkEmail,
    updatePassword
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticate");

const router = express.Router();

// Fetch countries
router.get("/country", fetchCountries);

// Fetch states based on selected country
router.get("/states", fetchStates);

// Register student
router.post("/register", registerStudent);

// Login student
router.post("/login", loginStudent);

// Check if email exists
router.post("/checkEmail", checkEmail);

// Update password
router.post("/update-password", updatePassword);

module.exports = router;

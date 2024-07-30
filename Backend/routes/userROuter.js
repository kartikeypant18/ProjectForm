const express = require("express");
const {
  fetchCountries,
  fetchStates,
  registerStudent,
  loginStudent, // Import the login function
} = require("../controllers/userController");

const router = express.Router();

// Fetch countries
router.get("/country", fetchCountries);

// Fetch states based on selected country
router.get("/states", fetchStates);

// Register student
router.post("/register", registerStudent);

// Login student
router.post("/login", loginStudent); // Add the login route

module.exports = router;

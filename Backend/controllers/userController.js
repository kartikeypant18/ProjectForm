const db = require("../config/db.js");
const bcrypt = require('bcryptjs');

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

// Register student
const registerStudent = (req, res) => {
  const { name, email, country_code, mobile_number, gender, country_id, state_id, password } = req.body;

  // Validate registration data
  const validationErrors = validateRegistrationData(req.body);
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  // Hash the password before storing
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      "INSERT INTO students (name, email, country_code, mobile_number, gender, country_id, state_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, country_code, mobile_number, gender, country_id, state_id, hashedPassword],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId });
      }
    );
  });
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

// Login student
const loginStudent = (req, res) => {
  const { email, password } = req.body;

  // Validate login data
  const validationErrors = validateLoginData(req.body);
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  // Fetch user based on email
  db.query("SELECT * FROM students WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare provided password with stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Successful login
      res.status(200).json({ message: "Login successful", userId: user.id });
    });
  });
};

module.exports = {
  fetchCountries,
  fetchStates,
  registerStudent,
  loginStudent,
};

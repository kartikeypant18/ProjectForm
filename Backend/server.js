const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "", 
  database: "country_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// Fetch countries
app.get("/api/country", (req, res) => {
  db.query("SELECT country_id AS id, country_name AS name FROM country", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Fetch states based on selected country
app.get("/api/states", (req, res) => {
  const countryId = req.query.country_id;
  db.query(
    "SELECT state_id AS id, state_name AS name FROM states WHERE country_id = ?",
    [countryId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Register student
app.post("/api/register", (req, res) => {
  const { name, email, country_code, mobile_number, gender, country_id, state_id, password } = req.body;
  db.query(
    "INSERT INTO students (name, email, country_code, mobile_number, gender, country_id, state_id, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, email, country_code, mobile_number, gender, country_id, state_id, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: results.insertId });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

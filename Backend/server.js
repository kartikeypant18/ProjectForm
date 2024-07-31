const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(bodyParser.json());

// Use the user router for API routes
app.use("/api", userRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

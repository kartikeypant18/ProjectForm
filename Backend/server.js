const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Use the user router for API routes
app.use("/api", userRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

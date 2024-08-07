// userRoutes.js
const express = require("express");
const {
    fetchCountries,
    fetchStates,
    signupUser,
    loginUser,
    checkEmail,
    changePassword,
    getUsers,
    handleDelete,
    editUser,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/country", fetchCountries);
router.get("/states", fetchStates);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/checkEmail", checkEmail);
router.post("/changepassword", changePassword);
router.get("/users", getUsers);
router.delete("/delete/:userId", handleDelete);
router.put("/edit/:userId", editUser);

module.exports = router;

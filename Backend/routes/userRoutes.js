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
    submitContactRequest,
    fetchContactRequests,
} = require("../controllers/userController.js");

const router = express.Router();

router.get("/countries", fetchCountries);
router.get("/states", fetchStates);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/check-email", checkEmail);
router.post("/change-password", changePassword);
router.get("/users", getUsers);
router.delete("/users/:userId", handleDelete);
router.put("/users/:userId", editUser);
router.post("/contact", submitContactRequest);
router.get("/contact-requests", fetchContactRequests);

module.exports = router;

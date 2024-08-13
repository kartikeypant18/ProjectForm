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
    fetchEmailTemplates, // Add this line
    fetchEmailTemplateBySlug,
    updateEmailTemplate,
    sendReply,
    SetNewPassword,
    updateAttendanceStatus, // Add this line
} = require("../controllers/userController.js");
const authenticateToken = require("../middlewares/authenticateToken.js");

const router = express.Router();

router.get("/countries", fetchCountries);
router.get("/states", fetchStates);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/check-email", checkEmail);
router.post("/changepassword", changePassword);
router.get("/users", getUsers);
router.delete("/delete/:userId", handleDelete);
router.put("/users/:userId", editUser);
router.post("/contact", submitContactRequest);
router.get("/contact-requests", fetchContactRequests);
router.get("/email-templates", fetchEmailTemplates); // Fetch all email templates
router.get("/email-templates/:slug", fetchEmailTemplateBySlug);
router.put("/save-email-templates/:slug", updateEmailTemplate);
router.post("/sendReply",sendReply)
router.post("/setnewpassword", authenticateToken, SetNewPassword);
router.patch("/contact-requests/:id", updateAttendanceStatus); 

module.exports = router;
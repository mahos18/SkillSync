
const express = require("express");
const router = express.Router();

const { signupController, loginController,updateProfileController } = require("../controllers/authController");
const RegisterValidation = require("../middlewares/authvaldiation");
const LoginValidation = require("../middlewares/authvaldiation");
const auth = require("../middlewares/authMiddleware");

// POST /register
router.post("/register", RegisterValidation, signupController);
router.post("/login" ,loginController );
router.put("/onboard" ,auth,updateProfileController );

module.exports = router;
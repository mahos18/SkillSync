
const express = require("express");
const router = express.Router();

const { signupController, loginController } = require("../controllers/authController");
const RegisterValidation = require("../middlewares/authvaldiation");
const LoginValidation = require("../middlewares/authvaldiation");

// POST /register
router.post("/register", RegisterValidation, signupController);
router.post("/login" ,loginController );

module.exports = router;
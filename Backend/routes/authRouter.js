
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();
const UserModel = require("../models/User");

const { signupController, loginController,updateProfileController } = require("../controllers/authController");
const RegisterValidation = require("../middlewares/authvaldiation");
const LoginValidation = require("../middlewares/authvaldiation");
const auth = require("../middlewares/authMiddleware");

// POST /register
router.post("/register", RegisterValidation, signupController);
router.post("/login" ,loginController );
router.put("/onboard" ,auth,updateProfileController );






// {To add multiple user at a time}
// router.post("/seed-users", async (req, res) => {
//   try {
//     const users = req.body; // expect array of users from Postman

//     if (!Array.isArray(users)) {
//       return res.status(400).json({ success: false, msg: "Input must be an array of users" });
//     }

//     // Hash passwords for each user
//     const usersWithHashedPasswords = await Promise.all(
//       users.map(async (user) => {
//         const hashedPassword = await bcrypt.hash(user.password, 10);
//         return { ...user, password: hashedPassword };
//       })
//     );

//     // Insert into DB
//     const insertedUsers = await UserModel.insertMany(usersWithHashedPasswords);

//     res.json({
//       success: true,
//       msg: `${insertedUsers.length} users inserted successfully`,
//       users: insertedUsers,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, msg: "Server error", error: err.message });
//   }
// });

module.exports = router;
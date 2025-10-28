const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const UserModel = require("../models/User");
const Location = require("../models/Location") // your User schema file

// Signup Controller
const signupController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword
      
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        isOnboarded:newUser.isOnboarded,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ success: false, msg: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, msg: "Invalid credentials" });

    // generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        currentPosition: user.currentPosition,
        location: user.location,
        additionalEmail: user.additionalEmail,
        website: user.website,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        projects: user.projects,
        isOnboarded: user.isOnboarded
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};



// const updateProfileController = async (req, res) => {
//   try {
//     const userId = req.user.id; // assuming middleware sets req.user from JWT
//     const {
//       currentPosition,
//       location,
//       additionalEmail,
//       website,
//       bio,
//       skills,
//       experience,
//       projects
//     } = req.body;
//     const { latitude, longitude } = req.body;

//     // Find the user
//     const user = await UserModel.findById(userId);
//     if (!user) return res.status(404).json({ success: false, msg: "User not found" });

//     await Location.findOneAndUpdate(
//       { user: userId },
//       { location: { type: "Point", coordinates: [longitude, latitude] }, updatedAt: Date.now() },
//       { upsert: true, new: true }
//     );

//     // Update fields
//     user.currentPosition = currentPosition || user.currentPosition;
//     user.location = location || user.location;
//     user.additionalEmail = additionalEmail || user.additionalEmail;
//     user.website = website || user.website;
//     user.bio = bio || user.bio;
//     user.skills = skills || user.skills;
//     user.experience = experience || user.experience;
//     user.projects = projects || user.projects;
//     user.isOnboarded = true;

//     // Save
//     await user.save();

//     res.json({
//       success: true,
//       msg: "Profile updated successfully",
//       user: {
//         id: user._id,
//         fullName: user.fullName,
//         email: user.email,
//         currentPosition: user.currentPosition,
//         location: user.location,
//         additionalEmail: user.additionalEmail,
//         website: user.website,
//         bio: user.bio,
//         skills: user.skills,
//         experience: user.experience,
//         projects: user.projects,
//         isOnboarded: user.isOnboarded
//       }
//     });
//   } catch (err) {
//     if (err.name === "ValidationError") {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields",
//         details: messages
//       });
//     }
//     console.error(err);
//     res.status(500).json({ success: false, msg: "Server error", error: err.message });
//   }
// };

const updateProfileController = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      currentPosition,
      location,
      additionalEmail,
      website,
      bio,
      skills,
      experience,
      projects,
      latitude,
      longitude
    } = req.body;

    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({ success: false, msg: "User not found" });

    // ✅ FIX: Validate coordinates before saving
    if (
      typeof latitude === "number" &&
      typeof longitude === "number" &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      await Location.findOneAndUpdate(
        { user: userId },
        {
          location: { type: "Point", coordinates: [latitude,longitude ] },
          updatedAt: Date.now(),
        },
        { upsert: true, new: true }
      );
    } else {
      console.warn("Skipping geo update — invalid coordinates:", latitude, longitude);
    }

    // Update remaining fields
    user.currentPosition = currentPosition || user.currentPosition;
    user.location = location || user.location;
    user.additionalEmail = additionalEmail || user.additionalEmail;
    user.website = website || user.website;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.experience = experience || user.experience;
    user.projects = projects || user.projects;
    user.isOnboarded = true;

    await user.save();

    res.json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        currentPosition: user.currentPosition,
        location: user.location,
        additionalEmail: user.additionalEmail,
        website: user.website,
        bio: user.bio,
        skills: user.skills,
        experience: user.experience,
        projects: user.projects,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
        details: messages,
      });
    }
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error", error: err.message });
  }
};





module.exports = { signupController,loginController,updateProfileController };

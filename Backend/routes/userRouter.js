const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const NearbyController = require('../controllers/NearbyController') // adjust path if needed

// ---------------- GET CONNECTIONS ----------------
router.post('/connections', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, msg: 'userId is required' });

    const currentUser = await UserModel.findById(userId);
    if (!currentUser) return res.status(404).json({ success: false, msg: 'User not found' });

    // Find users not connected and not the current user
    const users = await UserModel.find({
      _id: { $nin: [currentUser._id, ...(currentUser.connections || [])] }
    }).select('-password'); // exclude password

    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
});

router.post("/nearby",NearbyController )

//to get single usr id for user to see otehr profile
router.get("/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});





module.exports = router;

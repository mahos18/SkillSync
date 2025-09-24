const express = require("express");
const UserModel = require("../models/User");
const router = express.Router();

router.get("/profile/:id", async (req,res)=>{
    try {
    const userId = req.params.id.trim();
    const user = await UserModel.findById(userId); // MongoDB example
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
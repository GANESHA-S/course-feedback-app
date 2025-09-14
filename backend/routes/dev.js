import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Promote a user to admin
router.put("/make-admin/:email", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { role: "admin" },
      { new: true }
    ).select("-passwordHash"); // hide passwordHash

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

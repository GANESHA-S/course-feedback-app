import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// -----------------------------
// ✅ Get logged-in student profile
// -----------------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// ✅ Update profile (text fields)
// -----------------------------
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, phone, dob, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.dob = dob || user.dob;
    user.address = address || user.address;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// ✅ Upload profile picture
// -----------------------------
router.post("/upload-pic", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePic = req.file.path; // cloudinary URL
    await user.save();

    res.json({ message: "Profile picture uploaded successfully", profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// ✅ Change Password (with rules)
// -----------------------------
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Current password is incorrect" });

    // Reject same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must not be same as old password" });
    }

    // Strong password validation
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character",
      });
    }

    // Save new password
    const hash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hash;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

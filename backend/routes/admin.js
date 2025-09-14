import express from "express";
import User from "../models/User.js";
import Feedback from "../models/Feedback.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * ✅ Dashboard Stats
 * Shows total feedback count and total registered students
 */
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });

    res.json({ totalFeedbacks, totalStudents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ View all students (excluding password hashes)
 */
router.get("/students", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-passwordHash");
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Block a student (prevent login)
 */
router.put("/students/:id/block", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: true },
      { new: true }
    ).select("-passwordHash");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student blocked", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Unblock a student
 */
router.put("/students/:id/unblock", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: false },
      { new: true }
    ).select("-passwordHash");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student unblocked", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Delete a student
 */
router.delete("/students/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Feedback trends (average rating per course)
 * Uses $lookup to join with Course collection for course names
 */
router.get("/feedback-trends", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const trends = await Feedback.aggregate([
      {
        $group: {
          _id: "$course", // courseId (ObjectId)
          averageRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses", // collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      { $unwind: "$courseInfo" },
      {
        $project: {
          courseId: "$_id",
          courseName: "$courseInfo.name",
          averageRating: 1,
          totalFeedbacks: 1,
        },
      },
      { $sort: { averageRating: -1 } },
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

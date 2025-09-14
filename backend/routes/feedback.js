import express from "express";
import Feedback from "../models/Feedback.js";
import Course from "../models/Course.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { Parser } from "json2csv";

const router = express.Router();

/**
 * ✅ Student: Submit feedback
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { courseId, rating, comments } = req.body;

    if (!courseId || !rating) {
      return res.status(400).json({ message: "Course and rating are required" });
    }

    // ✅ Validate course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Invalid course selected" });
    }

    // ✅ Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const feedback = await Feedback.create({
      course: courseId,
      student: req.user.id, // always use authenticated student
      rating,
      comments,
    });

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (err) {
    console.error("Error creating feedback:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Student: View their own feedbacks
 */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ student: req.user.id })
      .populate("course", "name description")
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Student: Edit their feedback
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { rating, comments } = req.body;

    // ✅ Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const feedback = await Feedback.findOne({ _id: req.params.id, student: req.user.id });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found or not authorized" });
    }

    if (rating !== undefined) feedback.rating = rating;
    if (comments !== undefined) feedback.comments = comments;

    await feedback.save();
    res.json({ message: "Feedback updated successfully", feedback });
  } catch (err) {
    console.error("Error updating feedback:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Student: Delete their feedback
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndDelete({
      _id: req.params.id,
      student: req.user.id,
    });

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found or not authorized" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Admin: View all feedbacks (with optional filters)
 */
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { courseId, rating, student } = req.query;

    const filter = {};
    if (courseId) filter.course = courseId;
    if (rating) filter.rating = rating;
    if (student) filter.student = student;

    const feedbacks = await Feedback.find(filter)
      .populate("course", "name description")
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching all feedbacks:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ✅ Admin: Export feedbacks to CSV
 */
router.get("/export", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("course", "name")
      .populate("student", "name email");

    const data = feedbacks.map((f) => ({
      course: f.course?.name,
      rating: f.rating,
      comments: f.comments,
      studentName: f.student?.name,
      studentEmail: f.student?.email,
      createdAt: f.createdAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("feedbacks.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Error exporting feedbacks:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

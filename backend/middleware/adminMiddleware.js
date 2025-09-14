// middleware/adminMiddleware.js

export const adminMiddleware = (req, res, next) => {
  try {
    // ✅ Ensure user is attached by authMiddleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user data found" });
    }

    // ✅ Check if user has admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // ✅ User is admin → allow access
    next();
  } catch (err) {
    console.error("Admin middleware error:", err.message);
    res.status(500).json({ error: "Server error in admin middleware" });
  }
};

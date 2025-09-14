// src/pages/student/Dashboard.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseId: "", rating: "", comments: "" });
  const [message, setMessage] = useState("");

  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Fetch courses once on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/feedback", form);
      setMessage("✅ Feedback submitted successfully!");
      setForm({ courseId: "", rating: "", comments: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to submit feedback");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Student Panel</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/student/dashboard" className="bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
            <Link
              to="/student/my-feedbacks"
              className="hover:bg-gray-700 p-2 rounded"
            >
              My Feedbacks
            </Link>
            <Link
              to="/student/profile"
              className="hover:bg-gray-700 p-2 rounded"
            >
              Profile
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
          {message && <p className="mb-2">{message}</p>}

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 shadow rounded-lg space-y-4"
          >
            {/* Course Dropdown */}
            <select
              className="w-full border p-2 rounded"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              required
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Rating Dropdown */}
            <select
              className="w-full border p-2 rounded"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
              required
            >
              <option value="">-- Rating --</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Comments */}
            <textarea
              className="w-full border p-2 rounded"
              placeholder="Write your comments..."
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

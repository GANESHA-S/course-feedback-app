// src/pages/admin/ManageCourses.jsx
import React, { useState, useEffect, useContext } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [message, setMessage] = useState("");
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/courses", { name: newCourse });
      setCourses([...courses, res.data]); // instantly add
      setNewCourse("");
      setMessage("✅ Course added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to add course");
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c._id !== id));
      setMessage("🗑 Course deleted successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("❌ Failed to delete course");
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/admin/dashboard" className="hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
            <Link to="/admin/students" className="hover:bg-gray-700 p-2 rounded">
              Manage Students
            </Link>
            <Link to="/admin/courses" className="bg-gray-700 p-2 rounded">
              Manage Courses
            </Link>
            <Link to="/admin/feedbacks" className="hover:bg-gray-700 p-2 rounded">
              Feedbacks
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded mt-6"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Courses</h2>

        {message && (
          <p className="mb-4 text-green-600 font-semibold">{message}</p>
        )}

        {/* Add Course */}
        <form onSubmit={addCourse} className="flex space-x-2 mb-6">
          <input
            type="text"
            placeholder="Course name"
            className="border p-2 rounded w-full"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </form>

        {/* Course List */}
        <div className="space-y-2">
          {courses.length === 0 ? (
            <p className="text-gray-500">No courses available</p>
          ) : (
            courses.map((c) => (
              <div
                key={c._id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span>{c.name}</span>
                <button
                  onClick={() => deleteCourse(c._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCourses;

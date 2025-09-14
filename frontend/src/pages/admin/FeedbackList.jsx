import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filter, setFilter] = useState({ course: "", rating: "", student: "" });
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.course) params.course = filter.course;
      if (filter.rating) params.rating = filter.rating;
      if (filter.student) params.student = filter.student; // name filter

      const res = await api.get("/feedback/all", { params });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleExport = async () => {
    try {
      const res = await api.get("/feedback/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "feedbacks.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const handleClearFilters = () => {
    setFilter({ course: "", rating: "", student: "" });
    fetchFeedbacks();
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
            <Link to="/admin/courses" className="hover:bg-gray-700 p-2 rounded">
              Manage Courses
            </Link>
            <Link to="/admin/feedbacks" className="bg-gray-700 p-2 rounded">
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
        <h2 className="text-2xl font-bold mb-4">All Feedbacks</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Filter by Course"
            value={filter.course}
            onChange={(e) => setFilter({ ...filter, course: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Filter by Rating"
            min={0}
            max={5}
            value={filter.rating}
            onChange={(e) => {
              const val = Math.max(0, Math.min(5, Number(e.target.value)));
              setFilter({ ...filter, rating: val });
            }}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Filter by Student Name"
            value={filter.student}
            onChange={(e) => setFilter({ ...filter, student: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={fetchFeedbacks}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Clear Filters
          </button>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedbacks found</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Course</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Comments</th>
                <th className="border px-4 py-2">Student</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f._id}>
                  <td className="border px-4 py-2">
                    {f.course
                      ? typeof f.course === "object"
                        ? f.course.name
                        : f.course
                      : "Unknown Course"}
                  </td>
                  <td className="border px-4 py-2">{f.rating ?? "-"}</td>
                  <td className="border px-4 py-2">{f.comments || "—"}</td>
                  <td className="border px-4 py-2">
                    {f.student
                      ? `${f.student.name} (${f.student.email})`
                      : "Unknown Student"}
                  </td>
                  <td className="border px-4 py-2">
                    {f.createdAt
                      ? new Date(f.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default FeedbackList;

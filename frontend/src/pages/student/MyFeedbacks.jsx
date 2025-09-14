import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // feedback being edited
  const [editForm, setEditForm] = useState({ rating: "", comments: "" });
  const { logout } = useContext(AuthContext);

  const fetchMyFeedbacks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/feedback/my");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch my feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Failed to delete feedback", err);
    }
  };

  const handleEdit = (feedback) => {
    setEditing(feedback._id);
    setEditForm({ rating: feedback.rating, comments: feedback.comments });
  };

  const handleSave = async () => {
    try {
      await api.put(`/feedback/${editing}`, editForm);
      setEditing(null);
      fetchMyFeedbacks();
    } catch (err) {
      console.error("Failed to update feedback", err);
    }
  };

  useEffect(() => {
    fetchMyFeedbacks();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Student Panel</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/student/dashboard" className="hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
            <Link to="/student/my-feedbacks" className="bg-gray-700 p-2 rounded">
              My Feedbacks
            </Link>
            <Link to="/student/profile" className="hover:bg-gray-700 p-2 rounded">
              Profile
            </Link>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">My Feedback</h2>

        {loading ? (
          <p>Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-500">You have not submitted any feedback yet.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Course</th>
                <th className="border px-4 py-2">Rating</th>
                <th className="border px-4 py-2">Comments</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f._id}>
                  <td className="border px-4 py-2">{f.course?.name}</td>
                  <td className="border px-4 py-2">
                    {editing === f._id ? (
                      <select
                        className="border p-1 rounded"
                        value={editForm.rating}
                        onChange={(e) =>
                          setEditForm({ ...editForm, rating: e.target.value })
                        }
                      >
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      f.rating
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editing === f._id ? (
                      <textarea
                        className="border p-1 rounded w-full"
                        value={editForm.comments}
                        onChange={(e) =>
                          setEditForm({ ...editForm, comments: e.target.value })
                        }
                      />
                    ) : (
                      f.comments
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 flex gap-2">
                    {editing === f._id ? (
                      <>
                        <button
                          onClick={handleSave}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(f)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(f._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
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

export default MyFeedback;

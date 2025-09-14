// src/pages/admin/ManageStudents.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const blockStudent = async (id) => {
    await api.put(`/admin/students/${id}/block`);
    fetchStudents();
  };

  const unblockStudent = async (id) => {
    await api.put(`/admin/students/${id}/unblock`);
    fetchStudents();
  };

  const deleteStudent = async (id) => {
    await api.delete(`/admin/students/${id}`);
    fetchStudents();
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
            <Link to="/admin/students" className="bg-gray-700 p-2 rounded">
              Manage Students
            </Link>
            <Link to="/admin/courses" className="hover:bg-gray-700 p-2 rounded">
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
        <h2 className="text-xl font-bold mb-4">Manage Students</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border">
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">
                  {s.blocked ? "Blocked" : "Active"}
                </td>
                <td className="p-2 border">
                  {s.blocked ? (
                    <button
                      onClick={() => unblockStudent(s._id)}
                      className="px-2 py-1 bg-green-500 text-white rounded mr-2"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => blockStudent(s._id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    >
                      Block
                    </button>
                  )}
                  <button
                    onClick={() => deleteStudent(s._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default ManageStudents;

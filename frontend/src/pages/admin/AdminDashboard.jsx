import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalFeedbacks: 0, totalStudents: 0 });
  const [trends, setTrends] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    const fetchTrends = async () => {
      try {
        const res = await api.get("/admin/feedback-trends");
        setTrends(res.data);
      } catch (err) {
        console.error("Failed to fetch trends", err);
      }
    };

    fetchStats();
    fetchTrends();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/admin/dashboard" className="bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
            <Link
              to="/admin/students"
              className="hover:bg-gray-700 p-2 rounded"
            >
              Manage Students
            </Link>
            <Link
              to="/admin/courses"
              className="hover:bg-gray-700 p-2 rounded"
            >
              Manage Courses
            </Link>
            <Link
              to="/admin/feedbacks"
              className="hover:bg-gray-700 p-2 rounded"
            >
              Feedbacks
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
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Total Feedbacks</h2>
            <p className="text-4xl font-bold text-blue-600">
              {stats.totalFeedbacks}
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold">Registered Students</h2>
            <p className="text-4xl font-bold text-green-600">
              {stats.totalStudents}
            </p>
          </div>
        </div>

        {/* Feedback Trends Chart */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Feedback Trends</h2>
          {trends.length === 0 ? (
            <p className="text-gray-500">No feedback data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="courseName"
                  label={{
                    value: "Course",
                    position: "insideBottom",
                    offset: -5,
                  }}
                />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="averageRating" fill="#3b82f6" name="Avg Rating" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

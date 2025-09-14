// src/pages/student/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    profilePic: "",
  });

  const [passwords, setPasswords] = useState({ current: "", newPass: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  // ✅ Update profile text fields
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile/me", profile);
      setMessage("✅ Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile");
    }
  };

  // ✅ Upload profile picture
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setLoading(true);
      const res = await api.post("/profile/upload-pic", formData);
      setProfile({ ...profile, profilePic: res.data.profilePic });
      setMessage("✅ Profile picture uploaded!");
    } catch (err) {
      console.error("Upload failed", err.response?.data || err.message);
      setMessage("❌ Failed to upload picture");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.post("/profile/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      setMessage("✅ Password changed successfully!");
      setPasswords({ current: "", newPass: "" });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to change password");
    }
  };

  // ✅ Logout handler
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6">Student Panel</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/student/dashboard" className="hover:bg-gray-700 p-2 rounded">
              Dashboard
            </Link>
            <Link to="/student/my-feedbacks" className="hover:bg-gray-700 p-2 rounded">
              My Feedbacks
            </Link>
            <Link to="/student/profile" className="bg-gray-700 p-2 rounded">
              Profile
            </Link>
          </nav>
        </div>

        {/* ✅ Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        {message && <p className="mb-4 text-blue-600">{message}</p>}

        {/* Avatar + Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-gray-100 overflow-hidden">
            {profile.profilePic ? (
              <a href={profile.profilePic} target="_blank" rel="noopener noreferrer">
                <img
                  src={profile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                />
              </a>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A11.953 11.953 0 0112 15c2.485 0 4.735.755 6.879 2.057M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </div>
          <label className="mt-3">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              {loading ? "Uploading..." : "Upload Picture"}
            </span>
          </label>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleUpdate} className="mb-6 space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            value={profile.email || ""}
            disabled
            className="w-full border p-2 bg-gray-200 rounded"
          />
          <input
            type="text"
            placeholder="Phone"
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            value={profile.dob ? profile.dob.substring(0, 10) : ""}
            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <textarea
            placeholder="Address"
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
            Update Profile
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="space-y-2">
          <h3 className="font-bold mb-2">Change Password</h3>

          {/* Current Password */}
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full border p-2 rounded pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* New Password */}
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              placeholder="New Password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
              className="w-full border p-2 rounded pr-10"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Change Password
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;

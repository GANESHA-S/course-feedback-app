import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Course Feedback System</h1>
        <p className="mb-6 text-gray-600">Welcome! Please choose an option:</p>

        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

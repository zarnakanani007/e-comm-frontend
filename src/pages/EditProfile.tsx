import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../redux/store";
import { setCredentials } from "../redux/authSlice";

const EditProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pre-fill the form with current user info
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

      // ✅ Add null check for token
  if (!token) {
    setError("Authentication token is missing. Please log in again.");
    return;
  }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/update",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update Redux store with new user info
      dispatch(setCredentials({ user: res.data.user, token }));

      setSuccess("Profile updated successfully!");
      // Redirect to profile after short delay
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Update Profile
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="w-full mt-2 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditProfile;

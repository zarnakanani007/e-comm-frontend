import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials } from "../redux/authSlice";
import type { AppDispatch } from "../redux/store";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(15, "Name must be less than 15 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address,please enter valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["user", "admin"], "Invalid role")
      .required("Role is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleRegister(values);
    },
  });

  // Handle avatar 
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);

      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Normal Register
  const handleRegister = async (values: typeof formik.values) => {
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("role", values.role);
      if (avatar) formData.append("avatar", avatar);

      await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      setMessage("Registration successful! Please login to continue.");

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate("/login", {
          state: {
            email: values.email, // Prefill email 
            message: "Registration successful! Please login."
          }
        });
      }, 1500);

      //  Reset form after successful registration
      formik.resetForm();
      setAvatar(null);
      setAvatarPreview(null);

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Google Login 
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        setMessage("Google login failed!");
        return;
      }

      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      // Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(setCredentials(res.data));

      setMessage("Google login successful!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.message || "Google login failed!");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 flex flex-col"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        {message && (
          <p className={`mb-2 text-center ${message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}>
            {message}
          </p>
        )}

        {/* Name Field */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`w-full p-2 border rounded cursor-text ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
              }`}
            autoComplete="new-name"
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`w-full p-2 border rounded cursor-text ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
              }`}
            autoComplete="new-email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className={`w-full p-2 border rounded cursor-text ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
              }`}
            autoComplete="new-password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
        </div>

        {/* Role Field */}
        <div className="mb-3">
          <select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded cursor-pointer ${formik.touched.role && formik.errors.role ? "border-red-500" : "border-gray-300"
              }`}
            autoComplete="off"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.role}</p>
          )}
        </div>

        {/* Avatar Upload */}
        <div className="mb-3">
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover mb-2 mx-auto cursor-default"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full cursor-pointer"
          />
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white mb-3 transition-colors ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 cursor-pointer"
            }`}
          disabled={loading || !formik.isValid}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {/* Google Login */}
        <div className="flex justify-center mb-3">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        <p className="text-sm text-gray-600 text-center mt-3">
          Already registered?{" "}
          <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
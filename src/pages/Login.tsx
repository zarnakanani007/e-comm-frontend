import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials } from "../redux/authSlice";
import type { AppDispatch } from "../redux/store";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address,please enter a valid email address!")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: location.state?.email || "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleLogin(values);
    },
  });

  // Normal login
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: values.email,
        password: values.password,
      });

      // Save to localStorage before dispatching
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch(setCredentials(res.data)); // { token, user }
      navigate("/"); // Redirect to Home after login
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) {
      setMessage("Google login failed!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      // Save to localStorage before dispatching
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      dispatch(setCredentials(res.data)); // { token, user }
      navigate("/"); // Redirect to Home
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Google login failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-blue-100">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96 flex flex-col"
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {message && <p className="text-red-500 mb-2 text-center">{message}</p>}

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
            className={`w-full p-2 border rounded ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
            autoComplete="email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.email as string}
            </p>
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
            className={`w-full p-2 border rounded ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
            autoComplete="current-password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white mb-3 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          } transition-colors duration-200`}
          disabled={loading || !formik.isValid}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Google Login */}
        <div className="flex justify-center mb-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        <p className="text-sm text-gray-600 text-center mt-3">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

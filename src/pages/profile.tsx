import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import type { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";
import { FaUser, FaEdit, FaShoppingBag, FaEnvelope, FaCalendar, FaCamera, FaSave, FaTimes, FaUsers, FaBox, FaChartBar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

const AdminProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address,please enter valid email address!")
      .required("Email is required"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSave(values);
    },
    enableReinitialize: true,
  });

  // Fetch admin profile and stats
  useEffect(() => {
    const fetchAdminProfileAndStats = async () => {
      if (!token) return;

      try {
        // Fetch admin profile
        const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = profileRes.data;
        formik.setValues({
          name: userData.name,
          email: userData.email,
        });
        setAvatarPreview(userData.avatar || null);

        // Fetch admin stats
        const statsRes = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdminStats(statsRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfileAndStats();
  }, [token]);

  // Handle avatar selection
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setEditing(true);
    }
  };

  // Save profile with avatar
  const handleSave = async (values: { name: string; email: string }) => {
    if (!token) {
      toast.error("Please log in to update profile");
      return;
    }

    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update Redux store
      dispatch(setCredentials({
        user: res.data.user,
        token
      }));

      setAvatarFile(null);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    formik.resetForm();
    setAvatarPreview(user?.avatar || null);
    setAvatarFile(null);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto cursor-default"></div>
          <p className="mt-4 text-lg text-gray-600 cursor-default">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-4 border-white border-opacity-20 cursor-default"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white border-opacity-20 cursor-default">
                    <FaUser className="w-10 h-10 text-white cursor-default" />
                  </div>
                )}

                {/*  avatar upload */}
                <button
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
                  title="Change Avatar"
                >
                  <FaCamera className="w-4 h-4 cursor-pointer" />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white cursor-default">{user?.name} </h1>
                <p className="text-blue-100 cursor-default">{user?.email}</p>
                <p className="text-blue-100 text-sm cursor-default">
                  Admin since {new Date(user?.createdAt || Date.now()).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${activeTab === "overview"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  📊 Admin Overview
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${activeTab === "settings"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  ⚙️ Profile Settings
                </button>
              </nav>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors cursor-pointer"
                >
                  <FaChartBar className="w-4 h-4" />
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/dashboard/users")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors cursor-pointer"
                >
                  <FaUsers className="w-4 h-4" />
                  Manage Users
                </button>

                <button
                  onClick={() => navigate("/dashboard/products")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors cursor-pointer"
                >
                  <FaBox className="w-4 h-4" />
                  Manage Products
                </button>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors cursor-pointer"
              >
                <FaEdit className="w-4 h-4 cursor-pointer" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <FaUsers className="text-blue-500 text-3xl mx-auto mb-3" />
                    <div className="text-2xl font-bold text-blue-600">{adminStats.totalUsers}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <FaBox className="text-green-500 text-3xl mx-auto mb-3" />
                    <div className="text-2xl font-bold text-green-600">{adminStats.totalProducts}</div>
                    <div className="text-gray-600">Total Products</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <FaShoppingBag className="text-purple-500 text-3xl mx-auto mb-3" />
                    <div className="text-2xl font-bold text-purple-600">{adminStats.totalOrders}</div>
                    <div className="text-gray-600">Total Orders</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <FaChartBar className="text-orange-500 text-3xl mx-auto mb-3" />
                    <div className="text-2xl font-bold text-orange-600">
                      ${adminStats.totalRevenue.toFixed(2)}
                    </div>
                    <div className="text-gray-600">Total Revenue</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 cursor-default">Quick Actions</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => navigate("/dashboard/create-product")}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer text-center"
                      >
                        <FaBox className="text-blue-500 text-2xl mx-auto mb-2" />
                        <p className="font-semibold text-gray-800">Add New Product</p>
                        <p className="text-sm text-gray-600">Create a new product listing</p>
                      </button>

                      <button
                        onClick={() => navigate("/dashboard/orders")}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors cursor-pointer text-center"
                      >
                        <FaShoppingBag className="text-green-500 text-2xl mx-auto mb-2" />
                        <p className="font-semibold text-gray-800">View Orders</p>
                        <p className="text-sm text-gray-600">Manage customer orders</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Profile Editing Form */}
                {editing && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 cursor-default">
                      Edit Admin Profile
                    </h3>
                    <form onSubmit={formik.handleSubmit} className="space-y-4">
                      {/* Name Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text ${formik.touched.name && formik.errors.name
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                          required
                        />
                        {formik.touched.name && formik.errors.name && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text ${formik.touched.email && formik.errors.email
                            ? "border-red-500"
                            : "border-gray-300"
                            }`}
                          required
                        />
                        {formik.touched.email && formik.errors.email && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={updating || !formik.isValid}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${updating || !formik.isValid
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                        >
                          <FaSave className="w-4 h-4" />
                          {updating ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                        >
                          <FaTimes className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 cursor-default">Admin Account Settings</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 p-4 border rounded-lg cursor-default">
                      <FaEnvelope className="text-blue-500 text-xl" />
                      <div>
                        <p className="font-semibold text-gray-800">Email Address</p>
                        <p className="text-gray-600">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg cursor-default">
                      <FaUser className="text-green-500 text-xl" />
                      <div>
                        <p className="font-semibold text-gray-800">Account Type</p>
                        <p className="text-gray-600">Administrator </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg cursor-default">
                      <FaCalendar className="text-purple-500 text-xl" />
                      <div>
                        <p className="font-semibold text-gray-800">Admin Since</p>
                        <p className="text-gray-600">
                          {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;




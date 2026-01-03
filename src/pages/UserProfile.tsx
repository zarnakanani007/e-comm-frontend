import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import type { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/authSlice";
import { FaUser, FaEdit, FaShoppingBag, FaEnvelope, FaCalendar, FaCamera, FaSave, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
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

  // Fetch user profile and orders
  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      if (!token) return;

      try {
        // Fetch user profile
        const profileRes = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = profileRes.data;
        formik.setValues({
          name: userData.name,
          email: userData.email,
        });
        setAvatarPreview(userData.avatar || null);

        // Fetch orders
        const ordersRes = await axios.get("http://localhost:5000/api/orders/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(ordersRes.data.orders || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
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

  // Delete account
  const handleDeleteAccount = async () => {
    if (!token) {
      toast.error("Please log in");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await axios.delete("http://localhost:5000/api/auth/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(order => order.status === "processing").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto cursor-default"></div>
          <p className="mt-4 text-lg text-gray-600 cursor-default">Loading profile...</p>
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

                {/* Camera icon for avatar upload */}
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
                <h1 className="text-2xl font-bold text-white cursor-default">{user?.name}</h1>
                <p className="text-blue-100 cursor-default">{user?.email}</p>
                <p className="text-blue-100 text-sm cursor-default">
                  Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
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
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  📊 Overview
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  🛍️ My Orders
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  ⚙️ Settings
                </button>
              </nav>

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
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                    <div className="text-gray-600">Total Orders</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <div className="text-2xl font-bold text-green-600">
                      ${stats.totalSpent.toFixed(2)}
                    </div>
                    <div className="text-gray-600">Total Spent</div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 text-center cursor-default">
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.pendingOrders}
                    </div>
                    <div className="text-gray-600">Pending Orders</div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800 cursor-default">Recent Orders</h2>
                  </div>
                  <div className="p-6">
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <FaShoppingBag className="text-gray-400 text-4xl mx-auto mb-4 cursor-default" />
                        <p className="text-gray-600 cursor-default">No orders yet</p>
                        <button
                          onClick={() => navigate("/Home")}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-default">
                            <div>
                              <p className="font-semibold text-gray-800">
                                Order #{order._id.slice(-8)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">
                                ${order.total.toFixed(2)}
                              </p>
                              <span className={`px-2 py-1 rounded-full text-xs cursor-default ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <OrdersTab orders={orders} loading={loading} />
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                {/* Profile Editing Form */}
                {editing && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 cursor-default">
                      Edit Profile
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text ${
                            formik.touched.name && formik.errors.name 
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
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text ${
                            formik.touched.email && formik.errors.email 
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
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                            updating || !formik.isValid
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
                    <h2 className="text-xl font-semibold text-gray-800 cursor-default">Account Settings</h2>
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
                        <p className="text-gray-600">Standard User</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg cursor-default">
                      <FaCalendar className="text-purple-500 text-xl" />
                      <div>
                        <p className="font-semibold text-gray-800">Member Since</p>
                        <p className="text-gray-600">
                          {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Delete Account Button */}
                    <div className="border-t pt-6">
                      <button
                        onClick={handleDeleteAccount}
                        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors cursor-pointer"
                      >
                        Delete Account
                      </button>
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

// Separate component for Orders Tab
const OrdersTab: React.FC<{ orders: Order[]; loading: boolean }> = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800 cursor-default">Order History</h2>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto cursor-default"></div>
          <p className="mt-2 text-gray-600 cursor-default">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800 cursor-default">Order History</h2>
      </div>
      <div className="p-6">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <FaShoppingBag className="text-gray-400 text-4xl mx-auto mb-4 cursor-default" />
            <p className="text-gray-600 cursor-default">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-default">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Order #{order._id.slice(-8)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs cursor-default ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm cursor-default">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded cursor-default"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-gray-600">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
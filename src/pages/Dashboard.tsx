import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-red-600">
          You are not authorized. Only <strong>ADMIN</strong> can access this page!
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Admin Dashboard - Manage your store efficiently
          </p>
        </div>

        {/* Admin Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Product Management</h3>
            <p className="text-gray-600">Create and manage all products in your store</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">User Management</h3>
            <p className="text-gray-600">View and manage all registered users</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Store Analytics</h3>
            <p className="text-gray-600">Monitor your store performance and sales</p>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Create Product */}
          <div
            onClick={() => navigate("/dashboard/create-product")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Product</h3>
              <p className="text-gray-600">Add new products to your store</p>
            </div>
          </div>

          {/* View Users */}
          <div
            onClick={() => navigate("/dashboard/users")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-green-500"
          >
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">View Users</h3>
              <p className="text-gray-600">Manage all registered users</p>
            </div>
          </div>

          {/* View Products */}
          <div
            onClick={() => navigate("/dashboard/products")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-purple-500"
          >
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-8V4a1 1 0 00-1-1h-2a1 1 0 00-1 1v1M9 7h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">View Products</h3>
              <p className="text-gray-600">Manage existing products</p>
            </div>
          </div>
          {/*  Manage Orders */}
          <div
            onClick={() => navigate("/dashboard/orders")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-orange-500"
          >
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Orders</h3>
              <p className="text-gray-600">View and manage customer orders</p>
            </div>
          </div>

          {/* Profile */}
          <div
            onClick={() => navigate("/profile")}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-gray-500"
          >
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Profile</h3>
              <p className="text-gray-600">Manage your admin profile</p>
            </div>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-semibold">
            ⚡ Admin Access: You have full administrative privileges to manage products, users, and store settings.
          </p>
        </div>
      </div>

      {/* Analytics Dashboard */}

      {/* <div
        onClick={() => navigate("/dashboard/analytics")}
        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-teal-500"
      >
        <div className="text-center">
          <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
          <p className="text-gray-600">View sales reports and statistics</p>
        </div>
      </div> */}
    </div>

  );
};



export default Dashboard;





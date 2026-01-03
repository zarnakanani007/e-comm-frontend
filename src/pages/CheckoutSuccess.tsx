import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const orderId = location.state?.orderId || Math.random().toString(36).substr(2, 9).toUpperCase();
  const total = location.state?.total || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="text-green-500 text-6xl mb-6">
          <FaCheckCircle />
        </div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Order Successful!
        </h1>
        
        <p className="text-gray-600 mb-2">
          Thank you for your purchase!
        </p>
        
        <p className="text-gray-600 mb-6">
          Your order has been confirmed and will be shipped soon.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Order ID: <span className="font-mono font-semibold">#{orderId}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Total: <span className="font-semibold">${total.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Confirmation email will be sent shortly
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            <FaShoppingBag className="w-4 h-4" />
            View My Orders
          </button>
          
          <button
            onClick={() => navigate("/Home")}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
          >
            <FaHome className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
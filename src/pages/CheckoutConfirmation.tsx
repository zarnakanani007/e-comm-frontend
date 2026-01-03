import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { toast } from "react-hot-toast";

const CheckoutConfirmation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { items } = useSelector((state: RootState) => state.cart);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [processing, setProcessing] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    if (!token || !user) {
      toast.error("Please log in to complete order");
      navigate("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setProcessing(true);

    try {
      // Create order in database
      const orderData = {
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: total,
        status: "processing"
      };

      console.log("Creating order:", orderData); // Debug log

      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      const result = await response.json();
      console.log("Order created:", result); // Debug log
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      toast.success("Order placed successfully!");
      navigate("/checkout-success", { 
        state: { 
          orderId: result.order._id,
          total: total 
        } 
      });
      
    } catch (error: any) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button 
            onClick={() => navigate("/Home")}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Confirmation</h1>
          
          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            {items.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-6 py-4 border-t">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
          </div>

          {/* Shipping Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p className="text-sm text-gray-600 mt-2">
                Your order will be shipped to your registered address
              </p>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmOrder}
            disabled={processing}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
              processing 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {processing ? "Processing Order..." : "Confirm Order"}
          </button>

          {/* Back to Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="w-full mt-3 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
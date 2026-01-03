// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaUser, FaEnvelope, FaCalendar, FaShoppingBag, FaDollarSign } from "react-icons/fa";
// import { toast } from "react-hot-toast";

// interface OrderItem {
//   _id: string;
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   _id: string;
//   user: {
//     _id: string;
//     name: string;
//     email: string;
//   };
//   items: OrderItem[];
//   total: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const OrderDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const token = useSelector((state: RootState) => state.auth.token);
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         if (!token) {
//           navigate("/login");
//           return;
//         }

//         const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (!res.ok) throw new Error("Failed to fetch order details");
        
//         const data = await res.json();
//         setOrder(data.order);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         toast.error("Failed to load order details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchOrderDetails();
//     }
//   }, [id, token, navigate]);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "delivered":
//         return "bg-green-100 text-green-800 border-green-200";
//       case "shipped":
//         return "bg-blue-100 text-blue-800 border-blue-200";
//       case "processing":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200";
//       case "confirmed":
//         return "bg-purple-100 text-purple-800 border-purple-200";
//       case "cancelled":
//         return "bg-red-100 text-red-800 border-red-200";
//       case "pending":
//         return "bg-gray-100 text-gray-800 border-gray-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto cursor-default"></div>
//           <p className="mt-4 text-lg text-gray-600 cursor-default">Loading order details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
//           <button
//             onClick={() => navigate("/dashboard/orders")}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
//           >
//             Back to Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <button
//             onClick={() => navigate("/dashboard/orders")}
//             className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer"
//           >
//             <FaArrowLeft className="w-4 h-4" />
//             Back to Orders
//           </button>
//           <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Order Information */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Order Summary */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Order ID</p>
//                   <p className="font-semibold">{order._id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Order Date</p>
//                   <p className="font-semibold">{formatDate(order.createdAt)}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Status</p>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
//                     {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Order Items */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Items</h2>
//               <div className="space-y-4">
//                 {order.items.map((item, index) => (
//                   <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-16 h-16 object-cover rounded-lg"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-800">{item.name}</h3>
//                       <p className="text-gray-600">Quantity: {item.quantity}</p>
//                       <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold text-gray-800">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Customer Information */}
//           <div className="space-y-6">
//             {/* Customer Details */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaUser className="text-blue-500" />
//                 Customer Information
//               </h2>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <FaUser className="text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-600">Name</p>
//                     <p className="font-semibold">{order.user.name}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <FaEnvelope className="text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-600">Email</p>
//                     <p className="font-semibold">{order.user.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <FaCalendar className="text-gray-400" />
//                   <div>
//                     <p className="text-sm text-gray-600">Order Placed</p>
//                     <p className="font-semibold">{formatDate(order.createdAt)}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Order Totals */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                 <FaDollarSign className="text-green-500" />
//                 Order Total
//               </h2>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Subtotal:</span>
//                   <span className="font-semibold">${order.total.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping:</span>
//                   <span className="font-semibold">$0.00</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Tax:</span>
//                   <span className="font-semibold">$0.00</span>
//                 </div>
//                 <hr className="my-2" />
//                 <div className="flex justify-between text-lg">
//                   <span className="font-semibold">Total:</span>
//                   <span className="font-bold text-green-600">${order.total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;
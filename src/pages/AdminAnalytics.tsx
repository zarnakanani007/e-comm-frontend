// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// // Chart components 
// const BarChart = ({ data, title, color = "blue" }: { data: { label: string; value: number }[]; title: string; color?: string }) => {
//   const maxValue = Math.max(...data.map(item => item.value));
  
//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
//       <div className="space-y-2">
//         {data.map((item, index) => (
//           <div key={index} className="flex items-center gap-3">
//             <span className="text-sm text-gray-600 w-20 truncate">{item.label}</span>
//             <div className="flex-1 bg-gray-200 rounded-full h-6">
//               <div
//                 className={`h-6 rounded-full ${
//                   color === "blue" ? "bg-blue-500" :
//                   color === "green" ? "bg-green-500" :
//                   color === "purple" ? "bg-purple-500" : "bg-blue-500"
//                 }`}
//                 style={{ width: `${(item.value / maxValue) * 100}%` }}
//               ></div>
//             </div>
//             <span className="text-sm font-semibold text-gray-700">{item.value}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ProgressCard = ({ title, value, total, color = "blue" }: { title: string; value: number; total: number; color?: string }) => {
//   const percentage = total > 0 ? (value / total) * 100 : 0;
  
//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       <div className="flex items-end gap-2 mb-3">
//         <span className="text-3xl font-bold text-gray-800">{value}</span>
//         <span className="text-gray-500 text-sm">/ {total}</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full ${
//             color === "blue" ? "bg-blue-500" :
//             color === "green" ? "bg-green-500" :
//             color === "purple" ? "bg-purple-500" :
//             color === "red" ? "bg-red-500" : "bg-blue-500"
//           }`}
//           style={{ width: `${percentage}%` }}
//         ></div>
//       </div>
//       <p className="text-sm text-gray-600 mt-2">{percentage.toFixed(1)}%</p>
//     </div>
//   );
// };

// interface AnalyticsData {
//   totalRevenue: number;
//   totalOrders: number;
//   totalUsers: number;
//   totalProducts: number;
//   revenueByMonth: { month: string; revenue: number }[];
//   popularProducts: { name: string; sales: number }[];
//   orderStatusCounts: {
//     pending: number;
//     confirmed: number;
//     shipped: number;
//     delivered: number;
//     cancelled: number;
//   };
//   recentOrders: any[];
// }

// const AdminAnalytics: React.FC = () => {
//   const navigate = useNavigate();
//   const { user, token } = useSelector((state: RootState) => state.auth);
  
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

//   const isAdmin = user?.role === "admin";

//   // Fetch analytics data
//   const fetchAnalytics = async () => {
//     try {
//       setLoading(true);
      
//       // Since we don't have analytics API yet, we'll calculate from orders
//       const ordersResponse = await axios.get("http://localhost:5000/api/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const usersResponse = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const productsResponse = await axios.get("http://localhost:5000/api/products", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const orders = ordersResponse.data.orders || ordersResponse.data || [];
//       const users = usersResponse.data.users || usersResponse.data || [];
//       const products = productsResponse.data.products || productsResponse.data || [];

//       // Calculate analytics
//       const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      
//       // Calculate revenue by month (simplified)
//       const revenueByMonth = calculateRevenueByMonth(orders);
      
//       // Calculate popular products
//       const popularProducts = calculatePopularProducts(orders);
      
//       // Order status counts
//       const orderStatusCounts = {
//         pending: orders.filter((o: any) => o.status === 'pending').length,
//         confirmed: orders.filter((o: any) => o.status === 'confirmed').length,
//         shipped: orders.filter((o: any) => o.status === 'shipped').length,
//         delivered: orders.filter((o: any) => o.status === 'delivered').length,
//         cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
//       };

//       const analyticsData: AnalyticsData = {
//         totalRevenue,
//         totalOrders: orders.length,
//         totalUsers: users.length,
//         totalProducts: products.length,
//         revenueByMonth,
//         popularProducts,
//         orderStatusCounts,
//         recentOrders: orders.slice(0, 5), // Last 5 orders
//       };

//       setAnalytics(analyticsData);
      
//     } catch (error: any) {
//       console.error("Error fetching analytics:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch analytics data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to calculate revenue by month
//   const calculateRevenueByMonth = (orders: any[]) => {
//     const months = [
//       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//     ];
    
//     const revenueByMonth = months.map(month => ({ month, revenue: 0 }));
    
//     orders.forEach((order: any) => {
//       const orderDate = new Date(order.createdAt);
//       const monthIndex = orderDate.getMonth();
//       revenueByMonth[monthIndex].revenue += order.total || 0;
//     });
    
//     return revenueByMonth;
//   };

//   // Helper function to calculate popular products
//   const calculatePopularProducts = (orders: any[]) => {
//     const productSales: { [key: string]: { name: string; sales: number } } = {};
    
//     orders.forEach((order: any) => {
//       order.items.forEach((item: any) => {
//         const productName = item.name;
//         if (!productSales[productName]) {
//           productSales[productName] = { name: productName, sales: 0 };
//         }
//         productSales[productName].sales += item.quantity;
//       });
//     });
    
//     return Object.values(productSales)
//       .sort((a, b) => b.sales - a.sales)
//       .slice(0, 5); // Top 5 products
//   };

//   useEffect(() => {
//     if (!isAdmin) {
//       navigate("/dashboard");
//       return;
//     }
//     fetchAnalytics();
//   }, [isAdmin, navigate, token, timeRange]);

//   if (!isAdmin) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <h1 className="text-3xl font-bold text-red-600">
//           Access Denied. Admin only.
//         </h1>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg">Loading analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!analytics) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">No Data Available</h1>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
//           >
//             &larr; Back to Dashboard
//           </button>
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
//               <p className="text-gray-600">Track your store performance and sales</p>
//             </div>
//             <div className="flex gap-2">
//               {["week", "month", "year"].map((range) => (
//                 <button
//                   key={range}
//                   onClick={() => setTimeRange(range as any)}
//                   className={`px-4 py-2 rounded-lg capitalize ${
//                     timeRange === range
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   {range}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
//             <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
//             <p className="text-blue-100 text-sm mt-2">All time sales</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
//             <p className="text-3xl font-bold">{analytics.totalOrders}</p>
//             <p className="text-green-100 text-sm mt-2">Orders placed</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Users</h3>
//             <p className="text-3xl font-bold">{analytics.totalUsers}</p>
//             <p className="text-purple-100 text-sm mt-2">Registered customers</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Products</h3>
//             <p className="text-3xl font-bold">{analytics.totalProducts}</p>
//             <p className="text-orange-100 text-sm mt-2">Available products</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Revenue Chart */}
//           <BarChart
//             title="Monthly Revenue"
//             data={analytics.revenueByMonth.map(item => ({
//               label: item.month,
//               value: item.revenue
//             }))}
//             color="blue"
//           />

//           {/* Popular Products */}
//           <BarChart
//             title="Popular Products"
//             data={analytics.popularProducts.map(item => ({
//               label: item.name,
//               value: item.sales
//             }))}
//             color="green"
//           />
//         </div>

//         {/* Order Status & Progress Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <ProgressCard
//             title="Orders Delivered"
//             value={analytics.orderStatusCounts.delivered}
//             total={analytics.totalOrders}
//             color="green"
//           />
//           <ProgressCard
//             title="Orders Shipped"
//             value={analytics.orderStatusCounts.shipped}
//             total={analytics.totalOrders}
//             color="purple"
//           />
//           <ProgressCard
//             title="Orders Pending"
//             value={analytics.orderStatusCounts.pending}
//             total={analytics.totalOrders}
//             color="blue"
//           />
//           <ProgressCard
//             title="Orders Cancelled"
//             value={analytics.orderStatusCounts.cancelled}
//             total={analytics.totalOrders}
//             color="red"
//           />
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
//           {analytics.recentOrders.length === 0 ? (
//             <p className="text-gray-600 text-center py-4">No recent orders</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {analytics.recentOrders.map((order: any) => (
//                     <tr key={order._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-900">
//                           {order.orderNumber || `ORD-${order._id.slice(-4)}`}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-900">
//                           ${(order.total || 0).toFixed(2)}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
//                           order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </p>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalytics;

// --------------------------------------------------------------

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import type { RootState } from "../redux/store";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// // Chart components 
// const BarChart = ({ data, title, color = "blue" }: { data: { label: string; value: number }[]; title: string; color?: string }) => {
//   const maxValue = Math.max(...data.map(item => item.value));
  
//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
//       <div className="space-y-2">
//         {data.map((item, index) => (
//           <div key={index} className="flex items-center gap-3">
//             <span className="text-sm text-gray-600 w-20 truncate">{item.label}</span>
//             <div className="flex-1 bg-gray-200 rounded-full h-6">
//               <div
//                 className={`h-6 rounded-full ${
//                   color === "blue" ? "bg-blue-500" :
//                   color === "green" ? "bg-green-500" :
//                   color === "purple" ? "bg-purple-500" : 
//                   color === "orange" ? "bg-orange-500" :
//                   color === "red" ? "bg-red-500" : "bg-blue-500"
//                 }`}
//                 style={{ width: `${(item.value / maxValue) * 100}%` }}
//               ></div>
//             </div>
//             <span className="text-sm font-semibold text-gray-700">{item.value}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const ProgressCard = ({ title, value, total, color = "blue" }: { title: string; value: number; total: number; color?: string }) => {
//   const percentage = total > 0 ? (value / total) * 100 : 0;
  
//   return (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
//       <div className="flex items-end gap-2 mb-3">
//         <span className="text-3xl font-bold text-gray-800">{value}</span>
//         <span className="text-gray-500 text-sm">/ {total}</span>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-2">
//         <div
//           className={`h-2 rounded-full ${
//             color === "blue" ? "bg-blue-500" :
//             color === "green" ? "bg-green-500" :
//             color === "purple" ? "bg-purple-500" :
//             color === "red" ? "bg-red-500" : "bg-blue-500"
//           }`}
//           style={{ width: `${percentage}%` }}
//         ></div>
//       </div>
//       <p className="text-sm text-gray-600 mt-2">{percentage.toFixed(1)}%</p>
//     </div>
//   );
// };

// interface AnalyticsData {
//   totalRevenue: number;
//   totalOrders: number;
//   totalUsers: number;
//   totalProducts: number;
//   revenueByMonth: { month: string; revenue: number }[];
//   popularProducts: { name: string; sales: number; category: string }[];
//   orderStatusCounts: {
//     pending: number;
//     confirmed: number;
//     shipped: number;
//     delivered: number;
//     cancelled: number;
//   };
//   recentOrders: any[];
//   // NEW: Category-wise analytics
//   categoryStats: {
//     category: string;
//     productCount: number;
//     totalSales: number;
//     revenue: number;
//   }[];
//   revenueByCategory: { category: string; revenue: number }[];
//   productsByCategory: { category: string; count: number }[];
// }

// const AdminAnalytics: React.FC = () => {
//   const navigate = useNavigate();
//   const { user, token } = useSelector((state: RootState) => state.auth);
  
//   const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

//   const isAdmin = user?.role === "admin";

//   // Fetch analytics data
//   const fetchAnalytics = async () => {
//     try {
//       setLoading(true);
      
//       const ordersResponse = await axios.get("http://localhost:5000/api/orders", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const usersResponse = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const productsResponse = await axios.get("http://localhost:5000/api/products", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const orders = ordersResponse.data.orders || ordersResponse.data || [];
//       const users = usersResponse.data.users || usersResponse.data || [];
//       const products = productsResponse.data.products || productsResponse.data || [];

//       // Calculate analytics
//       const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      
//       // Calculate revenue by month
//       const revenueByMonth = calculateRevenueByMonth(orders);
      
//       // Calculate popular products with categories
//       const popularProducts = calculatePopularProducts(orders, products);
      
//       // Order status counts
//       const orderStatusCounts = {
//         pending: orders.filter((o: any) => o.status === 'pending').length,
//         confirmed: orders.filter((o: any) => o.status === 'confirmed').length,
//         shipped: orders.filter((o: any) => o.status === 'shipped').length,
//         delivered: orders.filter((o: any) => o.status === 'delivered').length,
//         cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
//       };

//       // NEW: Calculate category-wise analytics
//       const categoryStats = calculateCategoryStats(orders, products);
//       const revenueByCategory = calculateRevenueByCategory(orders, products);
//       const productsByCategory = calculateProductsByCategory(products);

//       const analyticsData: AnalyticsData = {
//         totalRevenue,
//         totalOrders: orders.length,
//         totalUsers: users.length,
//         totalProducts: products.length,
//         revenueByMonth,
//         popularProducts,
//         orderStatusCounts,
//         recentOrders: orders.slice(0, 5),
//         categoryStats,
//         revenueByCategory,
//         productsByCategory,
//       };

//       setAnalytics(analyticsData);
      
//     } catch (error: any) {
//       console.error("Error fetching analytics:", error);
//       toast.error(error.response?.data?.message || "Failed to fetch analytics data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function to calculate revenue by month
//   const calculateRevenueByMonth = (orders: any[]) => {
//     const months = [
//       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
//     ];
    
//     const revenueByMonth = months.map(month => ({ month, revenue: 0 }));
    
//     orders.forEach((order: any) => {
//       const orderDate = new Date(order.createdAt);
//       const monthIndex = orderDate.getMonth();
//       revenueByMonth[monthIndex].revenue += order.total || 0;
//     });
    
//     return revenueByMonth;
//   };

//   // Helper function to calculate popular products with categories
//   const calculatePopularProducts = (orders: any[], products: any[]) => {
//     const productSales: { [key: string]: { name: string; sales: number; category: string } } = {};
    
//     // Create a map of product IDs to categories
//     const productCategoryMap: { [key: string]: string } = {};
//     products.forEach((product: any) => {
//       productCategoryMap[product._id] = product.category || 'uncategorized';
//     });
    
//     orders.forEach((order: any) => {
//       order.items.forEach((item: any) => {
//         const productName = item.name;
//         const productId = item.product || item._id;
//         const category = productCategoryMap[productId] || 'uncategorized';
        
//         if (!productSales[productName]) {
//           productSales[productName] = { name: productName, sales: 0, category };
//         }
//         productSales[productName].sales += item.quantity;
//       });
//     });
    
//     return Object.values(productSales)
//       .sort((a, b) => b.sales - a.sales)
//       .slice(0, 5);
//   };

//   // NEW: Calculate category statistics
//   const calculateCategoryStats = (orders: any[], products: any[]) => {
//     const categoryStats: { [key: string]: { category: string; productCount: number; totalSales: number; revenue: number } } = {};
    
//     // Initialize categories from products
//     products.forEach((product: any) => {
//       const category = product.category || 'uncategorized';
//       if (!categoryStats[category]) {
//         categoryStats[category] = {
//           category,
//           productCount: 0,
//           totalSales: 0,
//           revenue: 0
//         };
//       }
//       categoryStats[category].productCount++;
//     });
    
//     // Calculate sales and revenue by category
//     orders.forEach((order: any) => {
//       order.items.forEach((item: any) => {
//         const productId = item.product || item._id;
//         const product = products.find((p: any) => p._id === productId);
//         const category = product?.category || 'uncategorized';
        
//         if (categoryStats[category]) {
//           categoryStats[category].totalSales += item.quantity;
//           categoryStats[category].revenue += (item.price || 0) * item.quantity;
//         }
//       });
//     });
    
//     return Object.values(categoryStats).sort((a, b) => b.revenue - a.revenue);
//   };

//   // NEW: Calculate revenue by category
//   const calculateRevenueByCategory = (orders: any[], products: any[]) => {
//     const revenueByCategory: { [key: string]: number } = {};
    
//     orders.forEach((order: any) => {
//       order.items.forEach((item: any) => {
//         const productId = item.product || item._id;
//         const product = products.find((p: any) => p._id === productId);
//         const category = product?.category || 'uncategorized';
        
//         if (!revenueByCategory[category]) {
//           revenueByCategory[category] = 0;
//         }
//         revenueByCategory[category] += (item.price || 0) * item.quantity;
//       });
//     });
    
//     return Object.entries(revenueByCategory)
//       .map(([category, revenue]) => ({ category, revenue }))
//       .sort((a, b) => b.revenue - a.revenue);
//   };

//   // NEW: Calculate products count by category
//   const calculateProductsByCategory = (products: any[]) => {
//     const categoryCount: { [key: string]: number } = {};
    
//     products.forEach((product: any) => {
//       const category = product.category || 'uncategorized';
//       categoryCount[category] = (categoryCount[category] || 0) + 1;
//     });
    
//     return Object.entries(categoryCount)
//       .map(([category, count]) => ({ category, count }))
//       .sort((a, b) => b.count - a.count);
//   };

//   useEffect(() => {
//     if (!isAdmin) {
//       navigate("/dashboard");
//       return;
//     }
//     fetchAnalytics();
//   }, [isAdmin, navigate, token, timeRange]);

//   if (!isAdmin) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <h1 className="text-3xl font-bold text-red-600">
//           Access Denied. Admin only.
//         </h1>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg">Loading analytics...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!analytics) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-red-600 mb-4">No Data Available</h1>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="mb-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
//           >
//             &larr; Back to Dashboard
//           </button>
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
//               <p className="text-gray-600">Track your store performance and sales by categories</p>
//             </div>
//             <div className="flex gap-2">
//               {["week", "month", "year"].map((range) => (
//                 <button
//                   key={range}
//                   onClick={() => setTimeRange(range as any)}
//                   className={`px-4 py-2 rounded-lg capitalize ${
//                     timeRange === range
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                   }`}
//                 >
//                   {range}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Key Metrics */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
//             <p className="text-3xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
//             <p className="text-blue-100 text-sm mt-2">All time sales</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
//             <p className="text-3xl font-bold">{analytics.totalOrders}</p>
//             <p className="text-green-100 text-sm mt-2">Orders placed</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Users</h3>
//             <p className="text-3xl font-bold">{analytics.totalUsers}</p>
//             <p className="text-purple-100 text-sm mt-2">Registered customers</p>
//           </div>
          
//           <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-2">Total Products</h3>
//             <p className="text-3xl font-bold">{analytics.totalProducts}</p>
//             <p className="text-orange-100 text-sm mt-2">Available products</p>
//           </div>
//         </div>

//         {/* NEW: Category Analytics Section */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Analytics</h2>
          
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//             {/* Revenue by Category */}
//             <BarChart
//               title="Revenue by Category"
//               data={analytics.revenueByCategory.map(item => ({
//                 label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
//                 value: Math.round(item.revenue)
//               }))}
//               color="purple"
//             />

//             {/* Products by Category */}
//             <BarChart
//               title="Products by Category"
//               data={analytics.productsByCategory.map(item => ({
//                 label: item.category.charAt(0).toUpperCase() + item.category.slice(1),
//                 value: item.count
//               }))}
//               color="green"
//             />
//           </div>

//           {/* Category Statistics Table */}
//           <div className="bg-white rounded-lg shadow p-6 mb-8">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">Category Performance</h3>
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Category
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Products
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Total Sales
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Revenue
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {analytics.categoryStats.map((stat, index) => (
//                     <tr key={stat.category} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
//                           {stat.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-900">{stat.productCount}</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-900">{stat.totalSales}</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-green-600">${stat.revenue.toFixed(2)}</p>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           {/* Revenue Chart */}
//           <BarChart
//             title="Monthly Revenue"
//             data={analytics.revenueByMonth.map(item => ({
//               label: item.month,
//               value: item.revenue
//             }))}
//             color="blue"
//           />

//           {/* Popular Products */}
//           <BarChart
//             title="Popular Products"
//             data={analytics.popularProducts.map(item => ({
//               label: item.name,
//               value: item.sales
//             }))}
//             color="orange"
//           />
//         </div>

//         {/* Order Status & Progress Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <ProgressCard
//             title="Orders Delivered"
//             value={analytics.orderStatusCounts.delivered}
//             total={analytics.totalOrders}
//             color="green"
//           />
//           <ProgressCard
//             title="Orders Shipped"
//             value={analytics.orderStatusCounts.shipped}
//             total={analytics.totalOrders}
//             color="purple"
//           />
//           <ProgressCard
//             title="Orders Pending"
//             value={analytics.orderStatusCounts.pending}
//             total={analytics.totalOrders}
//             color="blue"
//           />
//           <ProgressCard
//             title="Orders Cancelled"
//             value={analytics.orderStatusCounts.cancelled}
//             total={analytics.totalOrders}
//             color="red"
//           />
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
//           {analytics.recentOrders.length === 0 ? (
//             <p className="text-gray-600 text-center py-4">No recent orders</p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Order
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Amount
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {analytics.recentOrders.map((order: any) => (
//                     <tr key={order._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-900">
//                           {order.orderNumber || `ORD-${order._id.slice(-4)}`}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="font-semibold text-gray-900">
//                           ${(order.total || 0).toFixed(2)}
//                         </p>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           order.status === 'delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
//                           order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <p className="text-sm text-gray-500">
//                           {new Date(order.createdAt).toLocaleDateString()}
//                         </p>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalytics;
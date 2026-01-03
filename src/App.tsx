import React, { useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "./redux/store";
import { logout } from "./redux/authSlice";
import { FaShoppingCart } from "react-icons/fa";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/profile";
import UserProfile from "./pages/UserProfile";
import Cart from "./pages/cart";
import Orders from "./pages/Orders";
import CreateProduct from "./pages/createProducts";
import UsersPage from "./pages/UserPages";
import ProductsPage from "./pages/ProductPage";
import EditProfile from "./pages/EditProfile";
import CheckoutConfirmation from "./pages/CheckoutConfirmation";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import ProductDetails from "./pages/productDetails";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetails from "./pages/AdminOrdersDetails";
import ProductReviews from "./pages/productReviews";
// import OrderDetails from "./pages/OrderDetails";

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Logout function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setShowLogoutConfirmation(false); 
  };

  const openLogoutConfirmation = () => {
    setShowLogoutConfirmation(true);
  };

  const closeLogoutConfirmation = () => {
    setShowLogoutConfirmation(false);
  };

  // NavBar links
  const navLinks = !token
    ? [
      { name: "Register", path: "/register", color: "green" },
      { name: "Login", path: "/login", color: "blue" },
    ]
    : user?.role === "admin"
      ? [
        { name: "Dashboard", path: "/dashboard", color: "indigo" },
        { name: "Create Product", path: "/dashboard/create-product", color: "blue" },
        { name: "View Users", path: "/dashboard/users", color: "green" },
        { name: "View Products", path: "/dashboard/products", color: "purple" },
        { name: "Profile", path: "/profile", color: "gray" },
      ]
      : [
        { name: "Home", path: "/Home", color: "purple" },
        { name: "Profile", path: "/profile", color: "gray" },
        { name: "Orders", path: "/orders", color: "gray" },
      ];

  // Tailwind CSS
  const getLinkClasses = (isActive: boolean, link: any) => {
    const baseClasses = "px-4 py-2 rounded-md font-semibold transition-colors duration-200";

    if (isActive) {
      switch (link.color) {
        case "indigo": return `${baseClasses} bg-indigo-600 text-white`;
        case "blue": return `${baseClasses} bg-blue-600 text-white`;
        case "green": return `${baseClasses} bg-green-600 text-white`;
        case "purple": return `${baseClasses} bg-purple-600 text-white`;
        case "gray": return `${baseClasses} bg-gray-600 text-white`;
        default: return `${baseClasses} bg-gray-600 text-white`;
      }
    } else {
      switch (link.color) {
        case "indigo": return `${baseClasses} text-indigo-600 hover:bg-indigo-100 cursor-pointer`;
        case "blue": return `${baseClasses} text-blue-600 hover:bg-blue-100 cursor-pointer`;
        case "green": return `${baseClasses} text-green-600 hover:bg-green-100 cursor-pointer`;
        case "purple": return `${baseClasses} text-purple-600 hover:bg-purple-100 cursor-pointer`;
        case "gray": return `${baseClasses} text-gray-600 hover:bg-gray-100 cursor-pointer`;
        default: return `${baseClasses} text-gray-600 hover:bg-gray-100 cursor-pointer`;
      }
    }
  };

  return (
    <>
      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Logout?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You'll need to login again to access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeLogoutConfirmation}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-800 cursor-default">MyDemoApp</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => getLinkClasses(isActive, link)}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Cart icon ONLY for normal users */}
          {token && user?.role !== "admin" && (
            <div className="relative group px-4 py-2 rounded-md text-yellow-600 hover:bg-yellow-100 cursor-pointer">
              <NavLink to="/cart">
                <FaShoppingCart className="w-5 h-5 inline" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </NavLink>
              {cartItems.length > 0 && (
                <div className="absolute hidden group-hover:block top-8 right-0 bg-black text-white border shadow-md rounded-md px-3 py-2 w-40 text-sm z-50">
                  <p className="font-semibold">Items: {cartItems.length}</p>
                  <p className="font-bold">Total: ${cartTotal.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* Logout button */}
          {token && (
            <button
              onClick={openLogoutConfirmation}
              className="px-4 py-2 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-800 focus:outline-none cursor-pointer"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md flex flex-col gap-2 px-4 py-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => getLinkClasses(isActive, link)}
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Cart  */}
          {token && user?.role !== "admin" && (
            <NavLink
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative px-4 py-2 rounded-md text-yellow-600 hover:bg-yellow-100 flex items-center gap-2 cursor-pointer"
            >
              <FaShoppingCart className="w-5 h-5" />
              Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </NavLink>
          )}

          {/* Mobile logout button */}
          {token && (
            <button
              onClick={() => {
                openLogoutConfirmation();
                setIsMobileMenuOpen(false);
              }}
              className="px-4 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors duration-200 text-left cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      )}

      {/* Toast notifications */}
      <Toaster position="top-center" />

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/register"
          element={
            <ProtectedRoute redirectIfLoggedIn>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute redirectIfLoggedIn>
              <Login />
            </ProtectedRoute>
          }
        />

        {/* Product Routes */}
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/reviews" element={<ProductReviews />} />

        {/* Protected Routes */}
        <Route path="/Home" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

        {/* Separate profiles for admin and user */}
        <Route path="/profile" element={
          <ProtectedRoute>
            {user?.role === "admin" ? <Profile /> : <UserProfile />}
          </ProtectedRoute>
        } />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/checkout-confirmation" element={<ProtectedRoute><CheckoutConfirmation /></ProtectedRoute>} />
        <Route path="/checkout-success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/create-product" element={<ProtectedRoute adminOnly><CreateProduct /></ProtectedRoute>} />
        <Route path="/dashboard/users" element={<ProtectedRoute adminOnly><UsersPage /></ProtectedRoute>} />
        <Route path="/dashboard/products" element={<ProtectedRoute adminOnly><ProductsPage /></ProtectedRoute>} />
        <Route path="/dashboard/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
        <Route path="/dashboard/orders/:id" element={<ProtectedRoute adminOnly><AdminOrderDetails /></ProtectedRoute>} />
        {/* <Route path="/dashboard/orders/:id" element={<ProtectedRoute adminOnly><OrderDetails /></ProtectedRoute>} /> */}

        {/* Default Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? <Dashboard /> : <UserDashboard />}
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">404 - Page Not Found</h1></div>} />
      </Routes>
    </>
  );
};

export default App;


// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchProducts } from "../redux/productSlice";
// import { addToCart } from "../redux/cartSlice";
// import type { RootState, AppDispatch } from "../redux/store";
// import { toast } from "react-hot-toast";
// import { Link } from "react-router-dom";

// const Home: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { products, loading, error } = useSelector((state: RootState) => state.products);
//   const { user } = useSelector((state: RootState) => state.auth);
//   const isAdmin = user?.role === "admin";

//   const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
//   //  categories here:=
//   const categories = [
//     "all", "Shoes", "Clothing", "Electronics", "Accessories", 
//     "Books", "Sports", "Home", "Beauty"
//   ];

//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   // Filter products by selected category
//   const filteredProducts = selectedCategory === "all" 
//     ? products 
//     : products.filter(product => product.category === selectedCategory);

//   const handleAddToCart = (product: any) => {
//     if (!product.inStock) {
//       toast.error("Product out of stock!");
//       return;
//     }
    
//     dispatch(addToCart({
//       _id: product._id,
//       name: product.name,
//       price: product.price,
//       quantity: 1,
//       image: product.image,
//       category: product.Category
//     }));
    
//     toast.success(`${product.name} added to cart!`);
//   };

//   // Get available categories from products 
//   const availableCategories = Array.from(
//     new Set(products.map(product => product.category).filter(Boolean))
//   );

//   const displayCategories = availableCategories.length > 0 
//     ? ['all', ...availableCategories] 
//     : categories;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      
//       {/* Category Filter */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-center">Categories</h2>
//         <div className="flex flex-wrap justify-center gap-2">
//           {displayCategories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
//                 selectedCategory === category
//                   ? "bg-blue-600 text-white shadow-md"
//                   : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
//               }`}
//             >
//               {category === 'all' ? 'All Products' : category}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Selected Category Title */}
//       {selectedCategory !== "all" && (
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 capitalize">
//           {selectedCategory} ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
//         </h2>
//       )}

//       {loading && (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       )}
      
//       {error && (
//         <div className="text-center py-4">
//           <p className="text-red-600 bg-red-100 inline-block px-4 py-2 rounded">{error}</p>
//         </div>
//       )}
      
//       {!loading && !error && filteredProducts.length === 0 && (
//         <div className="text-center py-8">
//           <p className="text-gray-500 text-lg">
//             {selectedCategory === "all" 
//               ? "No products available." 
//               : `No products found in ${selectedCategory} category.`}
//           </p>
//           <p className="text-gray-400 mt-2">Please check back later.</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {filteredProducts.map((product) => (
//           <div key={product._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col hover:shadow-lg transition-shadow duration-300">
//             {/* Product details wrapped in Link */}
//             <Link 
//               to={`/products/${product._id}`} 
//               className="flex flex-col flex-grow no-underline hover:no-underline"
//             >
//               <img 
//                 src={product.image} 
//                 alt={product.name} 
//                 className="w-full h-48 object-cover rounded-lg mb-3" 
//               />
//               <div className="flex-grow">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
//                 <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                
//                 {/* Category Badge */}
//                 {product.category && (
//                   <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2 capitalize">
//                     {product.category}
//                   </span>
//                 )}
                
//                 <div className="mt-auto">
//                   <p className="font-bold text-gray-900 text-lg">${product.price}</p>
//                   <p className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
//                     {product.inStock ? "In Stock" : "Out of Stock"}
//                   </p>
//                 </div>
//               </div>
//             </Link>

//             {/* Add to Cart button */}
//             {!isAdmin && (
//               <button
//                 onClick={() => handleAddToCart(product)}
//                 disabled={!product.inStock}
//                 className={`mt-3 py-2 px-4 rounded font-semibold text-white transition-colors ${
//                   product.inStock 
//                     ? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700" 
//                     : "bg-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 {product.inStock ? "Add to Cart" : "Out of Stock"}
//               </button>
//             )}

//             {/* Admin message */}
//             {isAdmin && (
//               <div className="mt-3 py-2 px-4 rounded font-semibold bg-gray-100 text-gray-600 text-center text-sm">
//                 Admin View - Cart Disabled
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Home;
import  { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../redux/store'
import { fetchProducts } from '../redux/productSlice'
import { FaShoppingCart, FaStar, FaArrowLeft, FaTag } from "react-icons/fa";
import { addToCart } from '../redux/cartSlice'
import { toast } from 'react-hot-toast';

function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { products, loading, error } = useSelector((state: RootState) => state.products);
    const { user } = useSelector((state: RootState) => state.auth);
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch, id]);

    const product = products.find((p) => p._id === id);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/Home')}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
                    <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/Home')}
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Go Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!product.inStock) {
            toast.error("This product is out of stock!");
            return;
        }

        dispatch(addToCart({
            _id: product._id!,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            category: product.category // ADD category to cart item
        }));
        toast.success(`${product.name} added to cart!`);
    }

    // Function to get category-specific features
    const getCategoryFeatures = (category: string) => {
        const features: { [key: string]: string[] } = {
            Shoes: [
                "Premium quality materials",
                "Comfortable for all-day wear",
                "Durable sole construction",
                "Available in multiple sizes"
            ],
            Clothing: [
                "High-quality fabric",
                "Machine washable",
                "Comfortable fit",
                "Multiple color options"
            ],
            electronics: [
                "1-year manufacturer warranty",
                "Latest technology",
                "Energy efficient",
                "Includes all Accessories"
            ],
            Accessories: [
                "Premium craftsmanship",
                "Versatile styling options",
                "Durable materials",
                "Perfect gift item"
            ],
            Books: [
                "High-quality printing",
                "Durable binding",
                "Fast delivery",
                "Satisfaction guaranteed"
            ],
            Sports: [
                "Professional grade quality",
                "Enhanced performance",
                "Durable construction",
                "Suitable for all levels"
            ],
            Home: [
                "Easy to assemble",
                "Premium materials",
                "Space saving design",
                "1-year warranty"
            ],
            Beauty: [
                "Cruelty-free",
                "Premium ingredients",
                "Hypoallergenic",
                "Satisfaction guaranteed"
            ]
        };

        return features[category] || [
            "High-quality materials",
            "Fast shipping available",
            "30-day return policy",
            "1-year warranty"
        ];
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <button
                        onClick={() => navigate('/Home')}
                        className="hover:text-blue-600 flex items-center gap-1 transition-colors"
                    >
                        <FaArrowLeft className="w-3 h-3" />
                        Back to Products
                    </button>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Product Image */}
                        <div className="flex justify-center">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full max-w-md h-96 object-cover rounded-lg shadow-md"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                    {product.name}
                                </h1>

                                {/* Category and Stock Status */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    {/* Category Badge */}
                                    {product.category && (
                                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium capitalize">
                                            <FaTag className="w-3 h-3" />
                                            {product.category}
                                        </span>
                                    )}

                                    {/* Stock Status */}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.inStock
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}>
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4">
                                <p className="text-4xl font-bold text-green-600">
                                    ${product.price}
                                </p>
                                {product.inStock && (
                                    <span className="text-sm text-gray-500">+ Free Shipping</span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {product.description || "No description available."}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4">
                                {!isAdmin && (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!product.inStock}
                                        className={`flex items-center justify-center gap-3 py-4 px-6 rounded-lg font-semibold text-lg transition-all ${product.inStock
                                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        <FaShoppingCart className="w-5 h-5" />
                                        {product.inStock ? "Add to Cart" : "Out of Stock"}
                                    </button>
                                )}

                                {isAdmin && (
                                    <div className="py-4 px-6 bg-gray-100 text-gray-600 rounded-lg text-center border border-gray-200">
                                        <span className="font-semibold">👨‍💼 Admin View</span>
                                        <p className="text-sm mt-1">Cart functionality disabled for admin accounts</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Link
                                        to={`/products/${product._id}/reviews`}
                                        className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center font-semibold transition-colors shadow-md hover:shadow-lg"
                                    >
                                        📝 View Reviews
                                    </Link>
                                    <button
                                        onClick={() => navigate('/Home')}
                                        className="flex-1 py-3 px-6 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-center font-semibold transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>

                            {/* Product Features */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
                                    <FaStar className="w-4 h-4 text-yellow-500" />
                                    Product Features
                                </h3>
                                <ul className="space-y-3">
                                    {getCategoryFeatures(product.category).map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-700">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="font-semibold text-gray-900 mb-3 text-lg">Shipping & Returns</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-green-600 mb-1">Free Shipping</div>
                                        <div>On orders over $50</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-blue-600 mb-1">30-Day Returns</div>
                                        <div>No questions asked</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="font-semibold text-purple-600 mb-1">Secure Payment</div>
                                        <div>100% protected</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Suggestion */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        More from {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'This Category'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products
                            .filter(p => p.category === product.category && p._id !== product._id)
                            .slice(0, 4)
                            .map(relatedProduct => (
                                <div
                                    key={relatedProduct._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => navigate(`/products/${relatedProduct._id}`)}
                                >
                                    <img
                                        src={relatedProduct.image}
                                        alt={relatedProduct.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
                                            {relatedProduct.name}
                                        </h3>
                                        <p className="text-green-600 font-bold">${relatedProduct.price}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    {products.filter(p => p.category === product.category && p._id !== product._id).length === 0 && (
                        <p className="text-center text-gray-500 py-4">
                            No other products found in this category.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetails;
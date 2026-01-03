import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { createProduct } from "../redux/productSlice";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.products);

  const [image, setImage] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Define categories
  const categories = ['Shoes', 'Clothing', 'Electronics', 'Accessories', 'Books', 'Sports', 'Home', 'Beauty'];

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name must be less than 100 characters")
      .required("Product name is required"),
    description: Yup.string()
      .min(100,"Description must be more than 20  characters")
      .max(500, "Description must be less than 500 characters")
      .required("description must required!"),
    price: Yup.number()
      .min(0.01, "Price must be greater than 0")
      .max(100000, "Price must be less than 100,000")
      .required("Price is required"),
    category: Yup.string()
      .oneOf(categories, "Invalid category")
      .required("Category is required"),
    inStock: Yup.boolean(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      category: "Clothing",
      inStock: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values: typeof formik.values) => {
    if (!image) {
      toast.error("Please select a product image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price.toString());
    formData.append("category", values.category);
    formData.append("inStock", values.inStock.toString());
    formData.append("image", image);

    try {
      setLoading(true);
      await dispatch(createProduct(formData)).unwrap();
      toast.success("Product created successfully!");

      // Reset form
      formik.resetForm();
      setImage(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 p-6">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
        encType="multipart/form-data"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Add New Product
        </h2>

        <div className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-text ${
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

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
              Description
            </label>
            <input
              type="text"
              placeholder="Enter product description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-text ${
                formik.touched.description && formik.errors.description 
                  ? "border-red-500" 
                  : "border-gray-300"
              }`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
              Price *
            </label>
            <input
              type="number"
              placeholder="Enter price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-text ${
                formik.touched.price && formik.errors.price 
                  ? "border-red-500" 
                  : "border-gray-300"
              }`}
              min="0"
              step="0.01"
              required
            />
            {formik.touched.price && formik.errors.price && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
              Category *
            </label>
            <select
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer ${
                formik.touched.category && formik.errors.category 
                  ? "border-red-500" 
                  : "border-gray-300"
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
              Product Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
              required
            />
            {!image && formik.submitCount > 0 && (
              <p className="text-red-500 text-sm mt-1">Product image is required</p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={formik.values.inStock}
              onChange={formik.handleChange}
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700 cursor-pointer">
              In Stock
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formik.isValid || !image}
          className={`w-full py-3 mt-6 rounded-lg font-semibold text-white transition-colors ${
            loading || !formik.isValid || !image
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg cursor-pointer"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Product...
            </span>
          ) : (
            "Add Product"
          )}
        </button>
      </form>

      {/* Live list of added products */}
      {products.length > 0 && (
        <div className="mt-8 w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-center cursor-pointer">Recently Added Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(-6).reverse().map((p) => (
              <div
                key={p._id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 line-clamp-1 cursor-pointer">{p.name}</p>
                    <p className="text-green-600 font-bold cursor-pointer">${p.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full cursor-pointer ${
                        p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize cursor-pointer">
                        {p.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProduct;
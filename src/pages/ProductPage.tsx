import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import {
  fetchProducts,
  updateProduct,
  deleteProduct,
} from "../redux/productSlice";
import type { Product } from "../redux/productSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);

  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Define categories
  const categories = [
    "all",
    "Shoes",
    "Clothing",
    "Electronics",
    "Accessories",
    "Books",
    "Sports",
    "Home",
    "Beauty",
  ];

  // Validation Schema for Edit Form
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name must be less than 100 characters")
      .required("Product name is required"),
    description: Yup.string()
      .min(20, "Description must be more than 20 characters!")
      .max(500, "Description must be less than 500 characters")
      .required("Description is required!"),
    price: Yup.number()
      .min(0.01, "Price must be greater than 0")
      .max(100000, "Price must be less than 100,000")
      .required("Price is required"),
    category: Yup.string()
      .oneOf(
        categories.filter((cat) => cat !== "all"),
        "Invalid category"
      )
      .required("Category is required"),
    inStock: Yup.boolean(),
  });

  // Formik setup for edit form
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
      await handleEditSave(values);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update formik values when editProduct changes
  React.useEffect(() => {
    if (editProduct) {
      formik.setValues({
        name: editProduct.name,
        description: editProduct.description || "",
        price: editProduct.price,
        category: editProduct.category,
        inStock: editProduct.inStock,
      });
    }
  }, [editProduct]);

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleDelete = async (id: string) => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await dispatch(deleteProduct({ id, token })).unwrap();
      toast.success("Product deleted successfully!");
    } catch (err: any) {
      toast.error(err || "Failed to delete product.");
    }
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setNewImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewImage(e.target.files[0]);
  };

  const handleEditSave = async (values: typeof formik.values) => {
    if (!editProduct) return;

    // ✅ Add null check
    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", values.price.toString());
      formData.append("description", values.description);
      formData.append("inStock", values.inStock.toString());
      formData.append("category", values.category);
      if (newImage) formData.append("image", newImage);

      await dispatch(
        updateProduct({ id: editProduct._id!, formData, token })
      ).unwrap();
      toast.success("Product updated successfully!");
      dispatch(fetchProducts());
      setEditProduct(null);
      setNewImage(null);
      formik.resetForm();
    } catch (err: any) {
      toast.error(err || "Failed to update product.");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditProduct(null);
    setNewImage(null);
    formik.resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition cursor-pointer"
      >
        &larr; Back to Dashboard
      </button>

      <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 cursor-pointer">
            Products Management
          </h1>
          <button
            onClick={() => navigate("/dashboard/create-product")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
          >
            + Create Product
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
            Filter by Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          {selectedCategory !== "all" && (
            <span className="ml-4 text-sm text-gray-600 cursor-pointer">
              Showing {filteredProducts.length} products in {selectedCategory}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 cursor-pointer"></div>
            <span className="ml-2 text-gray-600 cursor-pointer">
              Loading products...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg cursor-pointer">
              {selectedCategory === "all"
                ? "No products found."
                : `No products found in ${selectedCategory} category.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Image",
                    "Name",
                    "Category",
                    "Price",
                    "Stock",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredProducts.map((p, i) => (
                  <tr
                    key={p._id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 cursor-pointer`}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 font-medium cursor-pointer">
                      {p.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full capitalize cursor-pointer">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 cursor-pointer">
                      ${p.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                          p.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id!)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 cursor-pointer">
              Edit Product
            </h2>

            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-text ${
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.name}
                    </p>
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      formik.touched.category && formik.errors.category
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    {categories
                      .filter((cat) => cat !== "all")
                      .map((category) => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.category}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-text ${
                      formik.touched.price && formik.errors.price
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    min="0"
                    step="0.01"
                  />
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.price}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 cursor-text ${
                      formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.description}
                    </p>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formik.values.inStock}
                    onChange={formik.handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label className="text-sm font-medium text-gray-700 cursor-pointer">
                    In Stock
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 cursor-pointer">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full cursor-pointer"
                  />
                  <div className="mt-2">
                    {newImage ? (
                      <img
                        src={URL.createObjectURL(newImage)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded cursor-pointer"
                      />
                    ) : (
                      <img
                        src={editProduct.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded cursor-pointer"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 px-4 py-2 text-white rounded hover:bg-gray-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading || !formik.isValid}
                  className={`px-4 py-2 text-white rounded transition cursor-pointer ${
                    editLoading || !formik.isValid
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

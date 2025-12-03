// src/AdminProductsPage.jsx
import React, { useEffect, useState } from "react";
import api from "./api";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiPackage,
  FiUsers,
  FiSettings,
} from "react-icons/fi";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  // النموذج الجديد لإنشاء منتج (يدعم صور متعددة)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    images: "",
    category: "",
    stock: "",
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchProducts();
  }, [user, token]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // ⭐ إصلاح روابط الصور
  // ================================
  function fixImage(img) {
    if (!img) return "/images/fallback.png";

    // حذف تكرار /images/images/images/...
    let fixed = img.replace(/(\/images\/)+/g, "/images/");

    // لو رابط خارجي
    if (fixed.startsWith("http")) return fixed;

    // لو من uploads/
    if (fixed.startsWith("/uploads") || fixed.startsWith("uploads")) {
      return "/" + fixed.replace(/^\/?/, "");
    }

    // لو لا يبدأ بـ /images/
    if (!fixed.startsWith("/images/")) {
      fixed = "/images/" + fixed.replace(/^\/+/, "");
    }

    return fixed;
  }


  // دالة صغيرة لتوحيد معالجة الصور
  const normalizeImages = (imagesValue) => {
    let arr = [];

    if (typeof imagesValue === "string") {
      arr = imagesValue
        .split(",")
        .map((i) => i.trim());
    } else if (Array.isArray(imagesValue)) {
      arr = imagesValue.map((i) => (i || "").trim());
    }

return arr.filter(Boolean).map(img => fixImage(img));

  };

  // ================================
  // ⭐ إضافة منتج جديد (يدعم Images array)
  // ================================
  const createProduct = async () => {
    try {
      const payload = {
        ...newProduct,
        images: normalizeImages(newProduct.images),
      };

      await api.post("/products/add", payload);
      fetchProducts();
      setShowAddModal(false);

      setNewProduct({
        name: "",
        description: "",
        price: "",
        images: "",
        category: "",
        stock: "",
      });
    } catch (err) {
      console.error(err);
      alert("خطأ في إنشاء المنتج");
    }
  };

  // ================================
  // ⭐ حفظ تعديل منتج
  // ================================
  const saveEdit = async () => {
    if (!editProduct) return;

    try {
      const payload = {
        ...editProduct,
        images: normalizeImages(editProduct.images),
      };

      await api.put(`/products/${editProduct._id}`, payload);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // ⭐ حذف منتج
  // ================================
  const deleteProduct = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف المنتج؟")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[]">
      {/* Sidebar */}
      <aside className="w-64 bg-[] text-white flex flex-col p-5 space-y-6">
        <h2 className="text-2xl font-bold tracking-wide text-center">
          Admin Panel
        </h2>
        <nav className="flex flex-col space-y-3 mt-8">
          <button className="flex items-center gap-3 hover:bg-[] px-4 py-2 rounded">
            <FiPackage /> Products
          </button>
          <button className="flex items-center gap-3 hover:bg-[] px-4 py-2 rounded">
            <FiUsers /> Users
          </button>
          <button className="flex items-center gap-3 hover:bg-[] px-4 py-2 rounded">
            <FiSettings /> Settings
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[]">
            Product Management
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[] hover:bg-[] text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-[] text-white">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-[] transition"
                >
                  <td className="p-3">
                  <img
  src={fixImage(product.images?.[0])}
  alt={product.name}
  className="w-16 h-16 object-cover rounded"
/>

                  </td>
                  <td className="p-3 font-medium text-[]">
                    {product.name}
                  </td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 font-semibold">{product.price} ₪</td>
                  <td className="p-3">{product.stock}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        setEditProduct({
                          ...product,
                          images: product.images
                            ? product.images.join(", ")
                            : "",
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[]">
              Add New Product
            </h2>

            {["name", "category", "description", "price", "stock"].map(
              (field) => (
                <input
                  key={field}
                  placeholder={field.toUpperCase()}
                  value={newProduct[field]}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, [field]: e.target.value })
                  }
                  className="border p-2 w-full mb-3 rounded"
                />
              )
            )}

            {/* ⭐ صور متعددة */}
            <input
              placeholder="Images (comma separated URLs or names)"
              value={newProduct.images}
              onChange={(e) =>
                setNewProduct({ ...newProduct, images: e.target.value })
              }
              className="border p-2 w-full mb-3 rounded"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={createProduct}
                className="px-4 py-2 bg-[] text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[]">
              Edit Product
            </h2>

            {["name", "category", "description", "price", "stock"].map(
              (field) => (
                <input
                  key={field}
                  value={editProduct[field]}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      [field]: e.target.value,
                    })
                  }
                  className="border p-2 w-full mb-3 rounded"
                />
              )
            )}

            {/* ⭐ صور متعددة */}
            <input
              value={editProduct.images}
              onChange={(e) =>
                setEditProduct({
                  ...editProduct,
                  images: e.target.value,
                })
              }
              className="border p-2 w-full mb-3 rounded"
              placeholder="Images (comma separated)"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-[] text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

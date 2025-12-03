// src/admin/ProductsPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import fixAdminImage from "../utils/fixAdminImage";

export default function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    images: "",
    topNote: "",
    heartNote: "",
    baseNote: "",
  });

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("❌ Error loading products:", err));
  }, []);

  // ================================
  // ⭐ رفع الصورة للسيرفر (Supabase)
  // ================================
  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/products/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("🟢 UPLOAD RESULT =", res.data.url);
      return res.data.url; // Supabase URL
    } catch (err) {
      console.error("❌ Image upload error:", err);
      return null;
    }
  };

  // ================================
  // ⭐ إضافة منتج (صور تعمل 100%)
  // ================================
  const addProduct = async () => {
    let imagesArray = [];

    // 1) صورة مرفوعة
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) imagesArray.push(uploadedUrl);
    }

    // 2) صور إضافية نصية (روابط جاهزة)
    if (newProduct.images) {
      const extra = newProduct.images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean);

      imagesArray.push(...extra);
    }

    console.log("🟦 FINAL IMAGES TO SAVE =", imagesArray);

    api
      .post("/products", {
        ...newProduct,
        images: imagesArray, // ⚠ مهم جداً Array وليس string
      })
      .then((res) => {
        setProducts((prev) => [...prev, res.data]);
        setNewProduct({
          name: "",
          price: "",
          description: "",
          images: "",
          topNote: "",
          heartNote: "",
          baseNote: "",
        });
        setImageFile(null);
      })
      .catch((err) => console.error("❌ Error adding product:", err));
  };

  // ================================
  // ⭐ تعديل منتج (صور تعمل 100%)
  // ================================
  const updateProduct = async () => {
    let imagesArray = [];

    // صورة جديدة
    if (editImageFile) {
      const uploadedUrl = await uploadImage(editImageFile);
      if (uploadedUrl) imagesArray.push(uploadedUrl);
    }

    // صور نصية
    if (editProduct.images) {
      const list = editProduct.images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean);

      imagesArray.push(...list);
    }

    console.log("🟪 UPDATE IMAGES =", imagesArray);

    api
      .put(`/products/${editProduct._id}`, {
        ...editProduct,
        images: imagesArray, // ⚠ مهم جداً Array وليس string
      })
      .then((res) => {
        setProducts((prev) =>
          prev.map((p) => (p._id === editProduct._id ? res.data : p))
        );
        setEditProduct(null);
        setEditImageFile(null);
      })
      .catch((err) => console.error("❌ Error updating product:", err));
  };

  // ================================
  // ⭐ حذف منتج
  // ================================
  const deleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    api
      .delete(`/products/${id}`)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      })
      .catch((err) => console.error("❌ Error deleting product:", err));
  };

  // ================================
  // ⭐ الواجهة
  // ================================
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {/* Top/Heart/Base Note */}
      <input
        placeholder="Top Note"
        className="border p-2 w-full mb-2"
        value={newProduct.topNote}
        onChange={(e) =>
          setNewProduct({ ...newProduct, topNote: e.target.value })
        }
      />

      <input
        placeholder="Heart Note"
        className="border p-2 w-full mb-2"
        value={newProduct.heartNote}
        onChange={(e) =>
          setNewProduct({ ...newProduct, heartNote: e.target.value })
        }
      />

      <input
        placeholder="Base Note"
        className="border p-2 w-full mb-2"
        value={newProduct.baseNote}
        onChange={(e) =>
          setNewProduct({ ...newProduct, baseNote: e.target.value })
        }
      />

      {/* إضافة منتج */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-semibold mb-3">Add New Product</h3>

        <input
          placeholder="Name"
          className="border p-2 mr-2 mb-2"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />

        <input
          placeholder="Price"
          type="number"
          className="border p-2 mr-2 mb-2"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-2"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <input
          placeholder="Extra Images (optional, comma separated)"
          className="border p-2 mr-2 mb-2 w-full"
          value={newProduct.images}
          onChange={(e) =>
            setNewProduct({ ...newProduct, images: e.target.value })
          }
        />

        <input
          placeholder="Description"
          className="border p-2 w-full mb-2"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              description: e.target.value,
            })
          }
        />

        <button
          onClick={addProduct}
          className="bg-[] text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {/* قائمة المنتجات */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3">
                  <img
                    src={fixAdminImage(p.images?.[0])}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => (e.target.src = "/images/fallback.png")}
                  />
                </td>

                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.price} ₪</td>
                <td className="p-3">{p.description}</td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      setEditProduct({
                        ...p,
                        images: p.images ? p.images.join(", ") : "",
                      })
                    }
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة التعديل */}
      {editProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="font-semibold mb-3">Edit Product</h3>

            <input
              className="border p-2 w-full mb-2"
              value={editProduct.name}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              type="number"
              value={editProduct.price}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Images (comma separated)"
              value={editProduct.images}
              onChange={(e) =>
                setEditProduct({ ...editProduct, images: e.target.value })
              }
            />

            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full mb-2"
              onChange={(e) => setEditImageFile(e.target.files[0])}
            />

            <textarea
              className="border p-2 w-full mb-3"
              value={editProduct.description}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Top Note"
              value={editProduct.topNote}
              onChange={(e) =>
                setEditProduct({ ...editProduct, topNote: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Heart Note"
              value={editProduct.heartNote}
              onChange={(e) =>
                setEditProduct({ ...editProduct, heartNote: e.target.value })
              }
            />

            <input
              className="border p-2 w-full mb-2"
              placeholder="Base Note"
              value={editProduct.baseNote}
              onChange={(e) =>
                setEditProduct({ ...editProduct, baseNote: e.target.value })
              }
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={updateProduct}
                className="bg-[] text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditProduct(null)}
                className="text-gray-600"
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

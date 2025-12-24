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
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  topNote_en: "",
  topNote_ar: "",
  heartNote_en: "",
  heartNote_ar: "",
  baseNote_en: "",
  baseNote_ar: "",
  price: "",
  images: "",
gender: [],
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

    api.post("/products", {
  name_en: newProduct.name_en,
  name_ar: newProduct.name_ar,
  description_en: newProduct.description_en,
  description_ar: newProduct.description_ar,
  topNote_en: newProduct.topNote_en,
  topNote_ar: newProduct.topNote_ar,
  heartNote_en: newProduct.heartNote_en,
  heartNote_ar: newProduct.heartNote_ar,
  baseNote_en: newProduct.baseNote_en,
  baseNote_ar: newProduct.baseNote_ar,
  price: newProduct.price,
  images: imagesArray,
  gender: newProduct.gender, // ✅
})


      .then((res) => {
        setProducts((prev) => [...prev, res.data]);
      setNewProduct({
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  topNote_en: "",
  topNote_ar: "",
  heartNote_en: "",
  heartNote_ar: "",
  baseNote_en: "",
  baseNote_ar: "",
  price: "",
  images: "",
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

console.log("🟡 FRONTEND → editProduct BEFORE SEND:", editProduct);

api.put(`/products/${editProduct._id}`, {
  name_en: editProduct.name_en,
  name_ar: editProduct.name_ar,
  description_en: editProduct.description_en,
  description_ar: editProduct.description_ar,
  topNote_en: editProduct.topNote_en,
  topNote_ar: editProduct.topNote_ar,
  heartNote_en: editProduct.heartNote_en,
  heartNote_ar: editProduct.heartNote_ar,
  baseNote_en: editProduct.baseNote_en,
  baseNote_ar: editProduct.baseNote_ar,
  price: editProduct.price,
  images: imagesArray,
  gender: editProduct.gender, // ✅
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

      useEffect(() => {
  if (editProduct) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
  };
}, [editProduct]);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>

      {/* إضافة منتج */}
      <div className="bg-white rounded shadow p-4 mb-6">
        <h3 className="font-semibold mb-3">Add New Product</h3>

        
<input
  placeholder="Name (English)"
  className="border p-2 w-full mb-2"
  value={newProduct.name_en}
  onChange={(e) => setNewProduct({ ...newProduct, name_en: e.target.value })}
/>

<input
  placeholder="Name (Arabic)"
  className="border p-2 w-full mb-2"
  value={newProduct.name_ar}
  onChange={(e) => setNewProduct({ ...newProduct, name_ar: e.target.value })}
/>

<textarea
  placeholder="Description (English)"
  className="border p-2 w-full mb-2"
  value={newProduct.description_en}
  onChange={(e) =>
    setNewProduct({ ...newProduct, description_en: e.target.value })
  }
/>

<textarea
  placeholder="Description (Arabic)"
  className="border p-2 w-full mb-2"
  value={newProduct.description_ar}
  onChange={(e) =>
    setNewProduct({ ...newProduct, description_ar: e.target.value })
  }
/>

<input
  placeholder="Top Note (EN)"
  className="border p-2 w-full mb-2"
  value={newProduct.topNote_en}
  onChange={(e) =>
    setNewProduct({ ...newProduct, topNote_en: e.target.value })
  }
/>

<input
  placeholder="Top Note (AR)"
  className="border p-2 w-full mb-2"
  value={newProduct.topNote_ar}
  onChange={(e) =>
    setNewProduct({ ...newProduct, topNote_ar: e.target.value })
  }
/>

<input
  placeholder="Heart Note (EN)"
  className="border p-2 w-full mb-2"
  value={newProduct.heartNote_en}
  onChange={(e) =>
    setNewProduct({ ...newProduct, heartNote_en: e.target.value })
  }
/>

<input
  placeholder="Heart Note (AR)"
  className="border p-2 w-full mb-2"
  value={newProduct.heartNote_ar}
  onChange={(e) =>
    setNewProduct({ ...newProduct, heartNote_ar: e.target.value })
  }
/>

<input
  placeholder="Base Note (EN)"
  className="border p-2 w-full mb-2"
  value={newProduct.baseNote_en}
  onChange={(e) =>
    setNewProduct({ ...newProduct, baseNote_en: e.target.value })
  }
/>

<input
  placeholder="Base Note (AR)"
  className="border p-2 w-full mb-2"
  value={newProduct.baseNote_ar}
  onChange={(e) =>
    setNewProduct({ ...newProduct, baseNote_ar: e.target.value })
  }
/>

<div className="mb-2">
  <p className="mb-1 font-medium">Gender</p>

  {[
    { k: "men", l: "Men" },
    { k: "women", l: "Women" },
    { k: "unisex", l: "Unisex" },
  ].map(g => (
    <label key={g.k} className="flex items-center gap-2 mb-1">
      <input
        type="checkbox"
        checked={newProduct.gender.includes(g.k)}
        onChange={(e) => {
          if (e.target.checked) {
            setNewProduct({
              ...newProduct,
              gender: [...newProduct.gender, g.k],
            });
          } else {
            setNewProduct({
              ...newProduct,
              gender: newProduct.gender.filter(x => x !== g.k),
            });
          }
        }}
      />
      {g.l}
    </label>
  ))}
</div>



        <button
          onClick={addProduct}
          className="bg-[] text-gray px-4 py-2 rounded"
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

<td>{p.name_en}</td>
                <td className="p-3">{p.price} ₪</td>
<td>{p.description_en}</td>

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
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">

    {/* المودال */}
    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">

      {/* زر الإغلاق */}
      <button
        onClick={() => setEditProduct(null)}
        className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-black"
      >
        ×
      </button>

      <h3 className="font-semibold mb-4 text-lg">Edit Product</h3>

          <input
  className="border p-2 w-full mb-2"
  placeholder="Name (English)"
  value={editProduct.name_en}
  onChange={(e) =>
    setEditProduct({ ...editProduct, name_en: e.target.value })
  }
/>

<input
  className="border p-2 w-full mb-2"
  placeholder="Name (Arabic)"
  value={editProduct.name_ar}
  onChange={(e) =>
    setEditProduct({ ...editProduct, name_ar: e.target.value })
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
  className="border p-2 w-full mb-2"
  placeholder="Description (English)"
  value={editProduct.description_en}
  onChange={(e) =>
    setEditProduct({ ...editProduct, description_en: e.target.value })
  }
/>

<textarea
  className="border p-2 w-full mb-2"
  placeholder="Description (Arabic)"
  value={editProduct.description_ar}
  onChange={(e) =>
    setEditProduct({ ...editProduct, description_ar: e.target.value })
  }
/>


           <input
  className="border p-2 w-full mb-2"
  placeholder="Top Note (EN)"
  value={editProduct.topNote_en}
  onChange={(e) =>
    setEditProduct({ ...editProduct, topNote_en: e.target.value })
  }
/>

<input
  className="border p-2 w-full mb-2"
  placeholder="Top Note (AR)"
  value={editProduct.topNote_ar}
  onChange={(e) =>
    setEditProduct({ ...editProduct, topNote_ar: e.target.value })
  }
/>

<input
  className="border p-2 w-full mb-2"
  placeholder="Heart Note (EN)"
  value={editProduct.heartNote_en}
  onChange={(e) =>
    setEditProduct({ ...editProduct, heartNote_en: e.target.value })
  }
/>

<input
  className="border p-2 w-full mb-2"
  placeholder="Heart Note (AR)"
  value={editProduct.heartNote_ar}
  onChange={(e) =>
    setEditProduct({ ...editProduct, heartNote_ar: e.target.value })
  }
/>

<input
  className="border p-2 w-full mb-2"
  placeholder="Base Note (EN)"
  value={editProduct.baseNote_en}
  onChange={(e) =>
    setEditProduct({ ...editProduct, baseNote_en: e.target.value })
  }
/>

<input
  className="border p-2 w-full mb-2"
  placeholder="Base Note (AR)"
  value={editProduct.baseNote_ar}
  onChange={(e) =>
    setEditProduct({ ...editProduct, baseNote_ar: e.target.value })
  }
/>

{[
  { k: "men", l: "Men" },
  { k: "women", l: "Women" },
  { k: "unisex", l: "Unisex" },
].map(g => (
  <label key={g.k} className="flex items-center gap-2 mb-1">
    <input
      type="checkbox"
      checked={editProduct.gender?.includes(g.k)}
      onChange={(e) => {
        if (e.target.checked) {
          setEditProduct({
            ...editProduct,
            gender: [...(editProduct.gender || []), g.k],
          });
        } else {
          setEditProduct({
            ...editProduct,
            gender: editProduct.gender.filter(x => x !== g.k),
          });
        }
      }}
    />
    {g.l}
  </label>
))}



            <div className="flex justify-end space-x-3">
              <button
                onClick={updateProduct}
                className="bg-[] text-gray px-4 py-2 rounded"
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

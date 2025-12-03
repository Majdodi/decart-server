// ✅ src/Cart.jsx (FIXED GLOBAL VERSION)
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { FiTrash } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { getProductImage } from "./utils/fixImage";

export default function Cart() {
  const { t } = useTranslation();
  const { cartItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const parsePrice = price =>
    typeof price === 'number'
      ? price
      : parseFloat(price.replace(/[^0-9.]/g, '')) || 0;

  const total = cartItems
    .reduce((sum, item) => sum + parsePrice(item.price) * item.qty, 0)
    .toFixed(2);

  const fmt = v =>
    new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(v);

  return (
    <div className="min-h-screen pt-24 px-6 flex justify-center bg-[]">
      <div className="w-full max-w-4xl space-y-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <h2 className="text-3xl font-semibold text-[]">
              {t('cartEmpty')}
            </h2>
 <button
  onClick={() => navigate('/shop')}
  className="btn-brown px-6 py-3 rounded"
>
  {t('continueShopping')}
</button>


          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[]">
                  {t('shoppingCart')}
                </h2>
                <p className="text-sm text-[] mt-1">
                  {t('products')}
                </p>
              </div>
            <button
  onClick={() => navigate('/shop')}
  className="px-5 py-2 rounded btn-brown"
>
  {t('continueShopping')}
</button>

            </div>


{/* ⭐ تنظيف عناصر السلة قبل العرض */}
{/* ⭐ تنظيف عناصر السلة قبل العرض */}
{cartItems
  .map(item => {
    // 🟦 أطبع العنصر الخام القادم من CartContext
console.log("🟦 RAW ITEM:", {
  id: item._id,
  name: item.name,
  images: item.images,
  image: item.image
});

// اطبع محتوى الصور لو موجودة
if (Array.isArray(item.images)) {
  item.images.forEach((img, idx) => {
    console.log(`🟨 IMAGE[${idx}] RAW VALUE:`, img);
  });
}


    const cleanedItem = {
      ...item,
      images: Array.isArray(item.images)
        ? item.images
        : typeof item.images === "string"
          ? [item.images]
          : item.image
            ? [item.image]
            : ["/images/fallback.png"]
    };

    // 🟩 أطبع بعد التنظيف
    console.log("🟩 CLEANED ITEM IMAGES:", {
      id: item._id,
      cleanedImages: cleanedItem.images
    });

    // 🟪 اطبع الصورة النهائية التي سيستخدمها getProductImage
    console.log("🟪 getProductImage RESULT:", {
      id: item._id,
      finalImage: getProductImage(cleanedItem)
    });

    console.log("🟣 CART PAGE → RAW cartItems =", cartItems);

cartItems.forEach(item => {
  console.log("🔵 ITEM = ", {
    id: item._id,
    name: item.name,
    images: item.images,
    image0: item.images?.[0],
  });
});

    return cleanedItem;
  })
  .map(item => (
    <div
      key={item._id}
      className="flex items-center justify-between bg-[] p-4 shadow rounded"
    >
      <div className="flex items-start space-x-4 flex-1 min-w-0">

        {/* 🔥 Debug قبل عرض الصورة */}
{/* 🔥 Debug قبل عرض الصورة */}
{console.log("🟥 IMAGE RENDER ATTEMPT:", {
  id: item._id,
  images: item.images,
  image0: item.images?.[0],
  final: getProductImage(item)
})}


  

     <img
  src={getProductImage(item)}
  alt={item.name}
  onError={(e) => {
    e.target.src = "/images/fallback.png";
  }}
  className="w-20 h-20 min-w-[80px] min-h-[80px] object-cover rounded-lg shadow-sm border border-[]"
/>


        <div className="space-y-1">
          <Link
            to={`/product/${item._id}`}
            className="block text-lg font-semibold hover:underline truncate -mt-1 text-[]"
          >
            {item.name}
          </Link>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-32 justify-center">
        <button
          onClick={() => updateQty(item._id, Math.max(1, item.qty - 1))}
          className="text-xl px-2 text-[]"
        >
          −
        </button>
        <span className="text-[]">{item.qty}</span>
        <button
          onClick={() => updateQty(item._id, item.qty + 1)}
          className="text-xl px-2 text-[]"
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(item._id)}
          className="text-xl text-[] hover:text-[]"
        >
          <FiTrash size={20} />
        </button>
      </div>

      <div className="text-right text-lg font-semibold w-24 text-[]">
        {fmt(parsePrice(item.price) * item.qty)}
      </div>
    </div>
))}



            <div className="flex justify-end mt-10">
              <div className="w-full max-w-sm text-right space-y-4">
                <p className="text-lg font-medium text-[]">
                  {t('estimatedTotal')}
                </p>
                <p className="text-xl font-semibold text-[]">
                  {fmt(parseFloat(total))}
                </p>
                <p className="text-sm text-[] leading-snug">
                  {t('taxIncluded')}{' '}
                  <span
                    className="underline cursor-pointer"
                    onClick={() => navigate('/checkout')}
                  >
                    {t('shipping')}
                  </span>{' '}
                  {t('shippingAndDiscounts')}
                </p>
               <button
  onClick={() => navigate('/checkout')}
  className="btn-brown-full"
>
  {t('checkout')}
</button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
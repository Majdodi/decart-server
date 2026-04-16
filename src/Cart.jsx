// ✅ src/Cart.jsx (FIXED GLOBAL VERSION)
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { FiTrash } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import fixImage from "./utils/fixImage";

export default function Cart() {
const { t, i18n } = useTranslation();
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

    return cleanedItem;
  })
  .map(item => (
    <div
      key={item._id}
      className="flex items-center justify-between bg-[] p-4 shadow rounded"
    >
      <div className="flex items-start space-x-4 flex-1 min-w-0">
     <img
src={fixImage(item.images?.[0])}
  alt={i18n.language === "ar" ? item.name_ar : item.name_en}
  onError={(e) => {
    e.target.src = "/images/fallback.png";
  }}
  className="w-20 h-20 object-cover rounded-lg border-0 shadow-none outline-none bg-transparent"
/>


        <div className="space-y-1">
          <Link
            to={`/product/${item._id}`}
            className="block text-lg font-semibold hover:underline truncate -mt-1 text-[]"
          >
  {i18n.language === "ar" ? item.name_ar : item.name_en}
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
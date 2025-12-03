// ✅ src/Checkout.jsx (FIXED GLOBAL VERSION)
import React, { useState, useRef, useEffect } from 'react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getProductImage } from "./utils/fixImage";
import api from "./api";

export default function Checkout() {
  const { t } = useTranslation();
  const { user, token } = useAuth();
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    country: 'Palestine',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    phone: '',
    paymentMethod: 'cod',
    cardNumber: '',
    expDate: '',
    cvv: '',
    nameOnCard: '',
    useShippingAsBilling: true,
    rememberMe: true,
    acceptTerms: false,
    email: ''
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const shippingRef = useRef(null);
  const [errors, setErrors] = useState({});



  // حساب الإجمالي والشحن والخصم
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0
  );

  const regionFees = {
    'الضفة': 20,
    'القدس': 30,
    'عرب الداخل': 50
  };

  const shippingFee =
    form.paymentMethod === 'cod' ? regionFees[form.address] || 0 : 0;

  let total = subtotal;
  if (discount) {
    if (discount.type === 'percentage') {
      total = total * (1 - discount.value / 100);
    } else if (discount.type === 'fixed') {
      total = total - discount.value;
    }
  }
  total += shippingFee;

  const fmt = v =>
    new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(v);

  // معالجة التغييرات في النموذج
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "paymentMethod" && value === "card") {
      alert("🚫 الدفع ببطاقة الائتمان غير مفعل حالياً.");
      return;
    }

    const errorMessage = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDiscountChange = (e) => {
    setDiscountCode(e.target.value);
  };

const handleApplyDiscount = async () => {
  console.log("🚀 APPLY DISCOUNT CLICKED");
  console.log("📤 SENDING:", { code: discountCode, totalAmount: subtotal });

  try {
    const response = await api.post("/admin/discounts/validate", {
      code: discountCode,
      totalAmount: subtotal,
    });

    console.log("✅ RESPONSE FROM SERVER:", response.data);

    // 👇 أهم خطوة (أنت ناسيها)
    setDiscount(response.data.discount);

    alert("🎉 تم تطبيق الخصم بنجاح!");

  } catch (error) {
    console.log("❌ APPLY DISCOUNT ERROR:", error);
    console.log("❌ ERROR RESPONSE:", error.response);

    alert(`❌ ${error.response?.data?.error || "حدث خطأ في تطبيق الخصم."}`);
  }
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        form: {
          ...form,
          paymentMethod:
            form.paymentMethod === "cod"
              ? "cash_on_delivery"
              : form.paymentMethod,
        },
      cartItems: cartItems.map((item) => ({
  productId: item.productId || item._id || item.id || item.product?._id || null,
  name: item.name || item.product?.name || "Unknown",
  price: Number(item.price || item.product?.price || 0),
  quantity: Number(item.qty ?? item.quantity ?? 1),
  image: item.image || item.product?.image || item.images?.[0] || null,
})),

        discountCode,
        shippingFee,
        total,
        userId: user?._id || null,
      };

      const response = await api.post("/orders/checkout", requestBody);
      const result = response.data;

      if (result.success) {
        alert(result.message || "✅ تم إنشاء الطلب بنجاح!");

        if (typeof clearCart === "function") clearCart();
        navigate("/order-success");
      } else {
        alert("⚠️ تم استلام الرد لكن لم يتم تأكيد الطلب من السيرفر.");
      }

      try {
        const prev = JSON.parse(localStorage.getItem("guestOrders") || "[]");
        const newList = Array.isArray(prev)
          ? [result.order, ...prev]
          : [result.order];
        localStorage.setItem("guestOrders", JSON.stringify(newList));
        window.dispatchEvent(new Event("guest-orders-updated"));
      } catch (err) {
        console.warn("⚠️ خطأ أثناء حفظ الطلب محلياً:", err);
      }
    } catch (error) {
      console.error("❌ خطأ أثناء إرسال الطلب:", error);
      alert("⚠️ لم يتم إرسال الطلب بنجاح، تحقق من الاتصال بالإنترنت أو أعد المحاولة.");
    }
  };

  const validateField = (name, value) => {
    if (!value.trim()) return "";

    switch (name) {
      case "firstName":
      case "lastName":
      case "city":
        return /^[A-Za-z\u0600-\u06FF\s]{2,30}$/.test(value)
          ? ""
          : "الرجاء إدخال حروف فقط";

      case "phone":
        return /^[0-9]{6,15}$/.test(value)
          ? ""
          : "الرجاء إدخال رقم هاتف صحيح";

      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "البريد الإلكتروني غير صالح";

      case "apartment":
        return /^[A-Za-z0-9\u0600-\u06FF\s\-]*$/.test(value)
          ? ""
          : "المدخل غير صالح";

      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-[] min-h-screen p-6">
      <form
        ref={shippingRef}
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 bg-[] p-8 h-auto md:h-[calc(100vh-80px)] overflow-y-auto hide-scrollbar rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-[]">{t('shipping')}</h2>
        
        <label className="block mb-1 text-sm font-medium text-[]">{t('countryRegion')}</label>
        <select
          name="country"
          value={form.country}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-6 bg-[] text-[]"
        >
          <option>Palestine</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="mb-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder={t('firstName')}
              className={`w-full p-3 border rounded bg-[] text-[]
                ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.firstName && form.firstName.trim() !== "" && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder={t('lastName')}
              className={`w-full p-3 border rounded bg-[] text-[]
                ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.lastName && form.lastName.trim() !== "" && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <label className="block mb-1 text-sm font-medium text-[]">{t('address')}</label>
        <select
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 bg-[] text-[]"
        >
          <option value="" disabled hidden>{t('selectRegion')}</option>
          <option value="الضفة">الضفة</option>
          <option value="القدس">القدس</option>
          <option value="عرب الداخل">عرب الداخل</option>
        </select>

        <div className="mb-4">
          <input
            name="apartment"
            value={form.apartment}
            onChange={handleChange}
            placeholder={t("apartmentOptional")}
            className={`w-full p-3 border rounded bg-[] text-[]
              ${errors.apartment ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.apartment && form.apartment.trim() !== "" && (
            <p className="text-red-600 text-sm mt-1">{errors.apartment}</p>
          )}
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t("city")}
              className={`w-full p-3 border rounded bg-[] text-[]
                ${errors.city ? "border-red-500" : "border-gray-300"}`}
              required
            />
            {errors.city && form.city.trim() !== "" && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder={t("phone")}
            className={`w-full p-3 border rounded bg-[] text-[]
              ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.phone && form.phone.trim() !== "" && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="mb-6">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("email") || "Email"}
            className={`w-full p-3 border rounded bg-[] text-[]
              ${errors.email ? "border-red-500" : "border-gray-300"}`}
            required
          />
          {errors.email && form.email.trim() !== "" && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-[]">{t('payment')}</h2>
        <p className="text-sm text-[] mb-4">{t('paymentSecure')}</p>

        <div className="mb-6 space-y-2">
          <label className="flex items-center space-x-2 text-[]">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={form.paymentMethod === 'card'}
              onChange={handleChange}
              className="mt-0.5"
            />
            <span>{t('creditCard')}</span>
          </label>
          <label className="flex items-center space-x-2 text-[]">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={form.paymentMethod === 'cod'}
              onChange={handleChange}
              className="mt-0.5"
            />
            <span>{t('cashOnDelivery')}</span>
          </label>
        </div>

        {form.paymentMethod === 'cod' && (
<div className="border border-[#594539] rounded-lg p-4 mb-6 bg-[] text-[]">
            <p className="font-medium">{t('cashOnDelivery')}</p>
            <p className="text-sm mt-2">{t('codDescription')}</p>
          </div>
        )}

<div className="border border-[#594539] rounded-lg p-4 mb-6 bg-[] text-[]">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
              className="mt-0.5"
            />
            <span>{t('saveInfo')}</span>
          </label>
        </div>

        <div className="text-sm text-[] mb-6">
          <label className="flex items-start space-x-2">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
              required
              className="mt-1"
            />
            <span>{t('acceptTermsText')}</span>
          </label>
        </div>

      <button
  type="submit"
  disabled={!form.acceptTerms}
  className={`w-full py-3 rounded font-semibold transition ${
    form.acceptTerms
      ? 'btn-brown'
      : 'bg-[#8a6a54]/40 text-white cursor-not-allowed'
  }`}
>
  {form.paymentMethod === 'cod' ? t('placeOrder') : t('payNow')}
</button>

      </form>

      {/* Order Summary */}
<div className="w-full md:w-1/2 bg-[] p-8 md:sticky md:top-20 md:max-h-[calc(100vh-80px)] md:overflow-y-auto hide-scrollbar rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6 text-[]">{t('orderSummary')}</h2>
        
        <div className="mb-6">
          {cartItems.map(item => (
<div key={item._id} className="flex items-center justify-between py-4 border-b border-[#594539]">
              {/* 🌍 استخدام getProductImage بدلاً من fixImage مباشرة */}
              <img
                src={getProductImage(item)}
                alt={item.name}
                onError={(e) => {
                  e.target.src = "/images/fallback.png";
                }}
                className="w-20 h-20 object-cover rounded"
              />

              <div className="flex-1 px-4">
                <p className="font-medium text-[]">{item.name}</p>
                <p className="text-sm text-[]">Qty: {item.qty || 1}</p>
              </div>
              
              <p className="font-medium text-[]">
                {fmt((Number(item.price) || 0) * (item.qty || 1))}
              </p>
            </div>
          ))}
        </div>

        <div className="flex mb-4">
          <input
            type="text"
            name="discountCode"
            value={discountCode}
            onChange={handleDiscountChange}
            placeholder={t('discountCode')}
            className="flex-1 p-2 border rounded-l bg-[] text-[]"
          />
        <button
  type="button"
  onClick={handleApplyDiscount}
  className="btn-brown px-6 py-2 rounded-r font-semibold"
>
  {t('apply')}
</button>

        </div>

        {discount && (
          <div className="flex justify-between text-sm text-[] mb-2">
            <span>الخصم</span>
            <span>
              -{discount.type === 'percentage'
                ? `${discount.value}%`
                : fmt(discount.value)}
            </span>
          </div>
        )}

        <div className="space-y-2 text-[]">
          <div className="flex justify-between text-sm">
            <span>{t('subtotal')}</span>
            <span>{fmt(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t('shipping')}</span>
            <span>
              {form.address && shippingFee > 0 ? fmt(shippingFee) : t('calculatedNext')}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-4 text-[]">
            <span>{t('total')}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
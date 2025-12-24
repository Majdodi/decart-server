//server/orders/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
   customerInfo: {
  name: { type: String, required: true },
email: { type: String, required: false, default: "" },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  detailedAddress: { type: String,required: true  }, // ⭐ جديد
  city: { type: String, required: true },
  country: { type: String, required: true },
},

    items: [
      {
        productId: { type: String },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
   subtotal: {
  type: Number,
  default: 0,
},

discount: {
  code: { type: String, default: null },
  type: { type: String, enum: ["percentage", "fixed"], default: null },
  value: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
},


totalAmount: {
  type: Number,
  required: true,
  min: 0,
},
shippingFee: { type: Number, required: true, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["cash_on_delivery", "credit_card"], // ✅ قيم رسمية
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // ✅ صار اختياري (guest مسموح)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

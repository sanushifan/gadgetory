const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    payment_method: {
      type: String,
      required: true,
    },
    order_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = new mongoose.model("Payment", paymentSchema);
module.exports = Payment;

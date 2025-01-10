const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  coupon: {
    type: mongoose.Schema.ObjectId,
    ref: "Coupon",
  },
  products: [
    {
      product_id: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

const Cart = new mongoose.model("Cart", cartSchema);
module.exports = Cart;

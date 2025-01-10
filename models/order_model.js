const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: String,
      default: () => uuidv4().slice(-8),
      unique: true,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    order_items: [
      {
        product_id: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
        offer_price: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
        "Requesting Return",
        "Rejected",
      ],
    },
    delivery_date: {
      type: Date,
    },
    returning_reason: {
      type: String,
    },
    total_price: {
      type: Number,
      default: 0,
      required: true,
    },
    discount_price: {
      type: Number,
      default: 0,
    },
    final_price: {
      type: Number,
      default: 0,
    },

    address: {
      full_name: {
        type: String,
        required: true,
      },
      house: {
        type: String,
        required: true,
      },
      road_map: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },

    order_date: {
      type: Date,
      default: Date.now,
    },
    coupon: {
      coupon_id: { type: mongoose.Schema.ObjectId, ref: "Coupon" },
      coupon_code: String,
      coupon_discount: Number,
    },

    payment_id: {
      type: String,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ["COD", "Razorpay"],
    },
    payment_status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"],
    },
  },
  {
    timestamps: true,
  }
);

const Order = new mongoose.model("Order", orderSchema);
module.exports = Order;

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    coupon_code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    coupon_used_users: [String],
    count: {
      type: Number,
      default: 0,
    },
    min_purchase_value: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = new mongoose.model("Coupon", couponSchema);
module.exports = Coupon;

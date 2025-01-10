const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    full_name: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },
    pincode: {
      type: String,
      required: true,
      match: /^[0-9]{6}$/,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
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
  },
  {
    timestamps: true,
  }
);

const Address = new mongoose.model("Addresses", addressSchema);
module.exports = Address;

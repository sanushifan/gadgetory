const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  sales_count: {
    type: Number,
    default: 0,
  },
  category_offer: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
     product_name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    category: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true,
    }],
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    material: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    offer_price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    rating:{
        type:Number,
        min:[0],
        max:[5]
    },

    selling_count:{
    type: Number,
    default: 0,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

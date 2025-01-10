const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    products: [
        {
          product_id: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true,
          },
          added_on:{
            type:Date,
            default:Date.now
          }
        },
      ],
});

const Wishlist = new mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;
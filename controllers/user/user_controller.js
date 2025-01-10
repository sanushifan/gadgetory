const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { sendOTPEmail, generateOTP } = require("../../helper/node_mailer");
const httpStatusCode = require("../../utils/http_status_codes");
const User = require("../../models/user_model");
const Product = require("../../models/product_model");
const Address = require("../../models/address_model");
const Cart = require("../../models/cart_model");
const Wishlist = require("../../models/wishlist_model");
const Order = require("../../models/order_model");
const Razorpay = require('razorpay');
const razorpay_instance = require('../../config/razorpay');  // Import Razorpay instance
const { empty } = require("./user_auth_controller");
const Coupon = require("../../models/coupon_model");
const Category = require("../../models/category_model");
const Wallet = require("../../models/wallet_model");


const { renderFile } = require("ejs");
const path = require('path');
const puppeteer = require('puppeteer');
 
module.exports = {
  logout: (req, res) => {
    req.session.destroy();
    res.status(httpStatusCode.OK).redirect("/");
  },
  get_badge_counts: async (req, res) => {
    
    
    let wishlist_count = await Wishlist.findOne({user_id:req.session.user_token},{products:1, _id:0})
    let cart_count = await Cart.findOne({user_id:req.session.user_token},{products:1 ,_id:0})
    
    res
      .status(httpStatusCode.OK)
      .json( {wishlist_count : wishlist_count?.products?.length || 0,cart_count : cart_count?.products?.length || 0 })
  }, 

  show_homepage: async (req, res) => {
    const products = await Product.find({ is_deleted: false }).limit(4);

    res
      .status(httpStatusCode.OK)
      .render("user/homepage", { products, active_page: "home" });
  },

  show_shop: async (req, res) => {
 
    try {
      const query = req.query.query;
      const category_id = req.query.category;
        
      req.session.search_query = query;
      req.session.category_id = category_id;


      let category = await Category.find({ is_deleted: false });
      if (query) {
        let products = await Product.find({
          is_deleted:false,
          $or: [
            { product_name: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        });

        res.status(httpStatusCode.OK).render("user/shop", {
          active_page: "shop",
          query: query,
          products: products,
          category,
        });
      } else if(category_id){
        
      let products = await Product.find({
          is_deleted:false,category:category_id
        });

        res.status(httpStatusCode.OK).render("user/shop", {
          active_page: "shop",
          query: query,
          category_id,
          products: products,
          category,
        });
      }else{
        let products = await Product.find({ is_deleted: false });

        res.status(httpStatusCode.OK).render("user/shop", {
          active_page: "shop",
          products: products,
          category:category || [],
        });
      }
    } catch (error) {
      console.error("Error in showing shop:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  },

  quick_sort: async (req, res) => {
    try {
      
      const query = req.session.search_query;
      const category_id = req.session.category_id;

      const { criteria } = req.query;

      let sortOption = {};
      // console.log(criteria);

      switch (criteria) {
        case "low-to-high":
          sortOption.offer_price = 1; // Ascending order
          break;
        case "high-to-low":
          sortOption.offer_price = -1; // Descending order
          break;
        case "a-to-z":
          sortOption.product_name = 1;
          break;
        case "z-to-a":
          sortOption.product_name = -1;
          break;
        case "new-arrivals":
          sortOption.updatedAt = -1;
          break;
        default:
          sortOption.updatedAt = 1;
      }

      if (query) {
        let products = await Product.find({
          is_deleted:false,
          $or: [
            
            { product_name: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
          
        }).sort(sortOption);
        return res.json(products);

      }else if(category_id){

        let products = await Product.find({

          is_deleted:false,
          category: category_id 
  
        }).sort(sortOption);
        return res.json(products);

      } else {
        let products = await Product.find({is_deleted:false}).sort(sortOption);

        // console.log(sortOption);
        // console.log(products);
        return res.json(products);
      }
    } catch (error) {
      console.error("Error fetching sorted products:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },

  product_details: async (req, res) => {
    let product_id = req.query.id;
    // console.log(req.query.id);
    let product = await Product.findOne({ _id: product_id });

    let products = await Product.find({
      is_deleted: false,
      category: product.category,
    });
    // console.log(product);

    res
      .status(httpStatusCode.OK)
      .render("user/shop_details", { product, products, active_page: "shop" });
  },
  show_profile: async (req, res) => {
    try {
      let user = await User.findOne({ _id: req.session.user_token });
      let addresses = await Address.find({ user_id: req.session.user_token });
      // console.log(addresses);

      res.status(httpStatusCode.OK).render("user/profile", {
        active_page: "profile",
        user,
        addresses,
      });
    } catch (error) {
      console.error("Error rendering profile:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
    
  },
  edit_user_detail: async (req, res) => {
    try {
      const user_id = req.session.user_token;
      const user = await User.findById(user_id);

      if (!user) {
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ success: false, message: "User not found" });
      } else {
        user.first_name = req.body.first_name || user.first_name;
        user.last_name = req.body.last_name || user.last_name;
        user.phno_number = req.body.phno_number || user.phno_number;
        // user.email = req.body.email || user.email;
        // user.password = req.body.password || user.password;

        await user.save();

        return res
          .status(httpStatusCode.OK)
          .json({ success: true, message: "User updated successfully"

        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
  },
  reset_password:async (req,res)=>{
    try {
      let { current_password,new_password } = req.body
      let user =  await User.findById(req.session.user_token)
      let result = await bcrypt.compare(current_password, user.password)

      if (result) {

        new_password = await bcrypt.hash(new_password, 10);
        await User.updateOne({_id:req.session.user_token},{$set:{password:new_password}})

        return res
          .status(httpStatusCode.OK)
          .json({ success: true, message: "password updated successfully"

        });

      // updating Password when the user have no Password (google verifyed users)
      }else if(user.password == null){

        return res
          .status(httpStatusCode.OK)
          .json({ success: true, message: "password updated successfully"

        });
      }else{
        return res
          .status(httpStatusCode.UNAUTHORIZED)
          .json({ success: false, message: "current Password is Wrong"

        });
      }    
    } catch (error) {
      console.error("Error in reset user password:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
  },

  show_profile_address:async(req,res)=>{
    try {
      let addresses = await Address.find({ user_id: req.session.user_token });

      res.status(httpStatusCode.OK).render("user/profile_address", {
        active_page: "profile",
        addresses,
      });
    } catch (error) {
      console.error("Error rendering profile:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
  },
  add_address: async (req, res) => {
    try {
      let address = {
        user_id: req.session.user_token,
        full_name: req.body.full_name,
        phone_number: req.body.phone_number,
        pincode: req.body.pincode,
        state: req.body.state,
        city: req.body.city,
        house: req.body.house,
        road_map: req.body.road_map,
      };
      await Address.insertMany([address]);
      let all_address = await Address.find()
      return res
        .status(httpStatusCode.OK)
        .json({ 
            success: true,
            message: "address added successfully",
            all_address,
  
          });
    } catch (error) {
      console.error("Error adding address:", error);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Server error", error });
    }
  },
  edit_address:async(req,res)=>{
    try {
      let address = {
        full_name: req.body.full_name,
        phone_number: req.body.phone_number,
        pincode: req.body.pincode,
        state: req.body.state,
        city: req.body.city,
        house: req.body.house,
        road_map: req.body.road_map,
      };
      await Address.updateOne({_id:req.body.id},{$set:address});
      let all_address = await Address.find()
      return res
        .status(httpStatusCode.OK)
        .json({ 
            success: true,
            message: "address added successfully",
            all_address,

          });  
    } catch (error) {
      console.error("Error adding address:", error);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Server error", error });
    }
  },

  delete_address: async (req, res) => {
    const addressId = req.params.id;

    try {
      // Find and delete the address from the database
      const deletedAddress = await Address.findByIdAndDelete(addressId);

      if (!deletedAddress) {
        // If no address is found with the given ID
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ success: false, message: "Address not found" });
      }

      // Respond with a success message
      res
        .status(httpStatusCode.OK)
        .json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
      // Handle any errors during the deletion process
      console.error("Error deleting address:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  },

  add_to_cart: async (req, res) => {
    try {

      let {product_id,quantity} = req.body
      let user_cart = await Cart.findOne({ user_id: req.session.user_token });
      if (user_cart) {

        const product_exists = user_cart.products.some(
          (item) => item.product_id == product_id
        );
        const product_qty = user_cart.products.some(
          (item) => item.quantity == quantity
        );
        if (product_exists && product_qty) {

          return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Product already exists in the cart.",
            redirect_url: "/shopping_cart",
          });
        } else if (product_exists && !product_qty) {
          await Cart.updateOne(
            { user_id: req.session.user_token },
            {
              $set: {
                products: {
                  product_id: product_id,
                  quantity: quantity || 1,
                },
              },
            }
          ); 
        } else {
          await Cart.updateOne(
            { user_id: req.session.user_token },
            {
              $addToSet: {
                products: {
                  product_id: product_id,
                  quantity: quantity || 1,
                },
              },
            }
          );
        }
      } else {
        let cart = {
          user_id: req.session.user_token,
          products: [
            {
              product_id: product_id,
              quantity: quantity || 1,
            },
          ],
        };
        await Cart.insertMany([cart]);
      }

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Product updated to cart.",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  show_shopping_cart: async (req, res) => {
    try {

      let cart = await Cart.findOne({ user_id: req.session.user_token }).populate('coupon')

      if (cart) {

        let productDetails = cart.products.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }));
        let products = await Product.find({
          _id: { $in: productDetails.map((x) => x.product_id) },
        });
  
        let products_with_qty = products.map((product) => {
          let cart_products = productDetails.find(
            (products) =>
              products.product_id.toString() === product._id.toString()
          );
          return {
            ...product.toObject(),
            qty_in_cart: cart_products ? cart_products.quantity : 0,
          };
        });
        // console.log(products_with_qty);
        if (products_with_qty <= 0) {
          await Cart.updateOne({user_id:req.session.user_token},{$set:{coupon:null}})
        }

        res.status(httpStatusCode.OK).render("user/shopping_cart", {
          active_page: "pages",
          products: products_with_qty || [],
          coupon: cart?.coupon || []
        });
      } else {
        res.status(httpStatusCode.OK).render("user/shopping_cart", {
          active_page: "pages",
          products:  [],
          coupon:  []
        });
      }

    } catch (error) {
      console.error("Error in rendering Cart:", error);
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }  }, 

  delete_cart: async (req, res) => {
    try {
      const product_id = req.params.id;
      await Cart.updateOne(
        { user_id: req.session.user_token },
        {
          $pull: {
            products: { product_id: product_id },
          },
        }
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "product removed successfully",
      });
    } catch (error) {
      // Handle any errors during the deletion process
      console.error("Error removing Product in Cart:", error);
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  update_cart: async (req, res) => {
    const products = req.body.products;

    try {
      for (const element of products) {
        await Cart.updateOne(
          {
            user_id: req.session.user_token,
            "products.product_id": element.productId,
          },
          {
            $set: {
              "products.$.quantity": element.quantity,
            },
          }
        );
      }
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "cart updated successfully",
      });
    } catch (error) {
      // Handle any errors during the deletion process
      console.error("Error update in Cart:", error);
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  show_checkout: async (req, res) => {
    try {
      let cart = await Cart.findOne({ user_id: req.session.user_token }).populate('coupon')
      console.log(cart);
       
      if (cart.products.length>0) {
        
        let products = await Product.find({
          _id: cart.products.map((ele) => ele.product_id),
          is_deleted:false
        });

        let productDetails = cart.products.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        }));
        let products_with_qty = products.map((product) => {
          let cart_products = productDetails.find(
            (products) =>
              products.product_id.toString() === product._id.toString()
          );
          return {
            ...product.toObject(),
            qty_in_cart: cart_products ? cart_products.quantity : 0,
          };
        });

        let addresses = await Address.find({ user_id: req.session.user_token });
        // console.log(cart);
        
        res.status(httpStatusCode.OK).render("user/checkout", {
          products: products_with_qty,
          addresses,
          coupon:cart.coupon,
          active_page: "",
        });
      } else {
        console.log('heheeh');
        
        res.redirect("/");
      }
    } catch (error) {
      console.error("Error rendering checkout :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },
  
  coupon_check: async(req,res)=>{
    try {      
      let coupon_id = req.body.coupon_code.toUpperCase()
      let total = req.body.sub_total
      
      let coupon = await Coupon.findOne({coupon_code:coupon_id})
      if (coupon) {
        // console.log('couponid in cart :',coupon._id);
        let coupon_used = await Coupon.findOne({used_user:req.session.user_token})
        
        if (coupon.count > 0 && !coupon_used) {

          await Cart.updateOne({user_id:req.session.user_token},{$set:{coupon:coupon._id}})

          return res.status(httpStatusCode.OK).json({
            success: true,
            discount: coupon.discount
          });
        }     
        else{
          return res.status(httpStatusCode.OK).json({
            success: false,
            discount: coupon.discount
          });
        }
        
      }else{
        
        console.log('Failed');

        return res.status(httpStatusCode.OK).json({
          success: false,
        });
      }
      
    } catch (error) {
      console.error("Error checking coupon in Cart:", error);
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  confirm_order: async (req, res) => {
    try {
      const { address, payment_method } = req.body;
      const { full_name, phone_number, pincode, state, city, house, road_map } = address;
      
      // Fetch cart and product details as before
      let cart = await Cart.findOne({ user_id: req.session.user_token }).populate('coupon')

      let products = await Product.find({
        _id: cart.products.map((ele) => ele.product_id), 
        is_deleted:false
      });
      
      let products_category= new Set([])
      products.forEach((ele)=>{
        ele.category.forEach((cat)=>{
          products_category.add(cat)
        })
      })
      products_category = [...products_category]
      console.log(products_category);
      
      let productDetails = cart.products.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));
  
      let products_with_qty = products.map((product) => {
        let cart_products = productDetails.find(
          (products) =>
            products.product_id.toString() === product._id.toString()
        );
        return {
          ...product.toObject(),
          qty_in_cart: cart_products ? cart_products.quantity : 0,
        };
      });
      
      let order_items = products_with_qty.map((ele) => ({
        product_id: ele._id ? ele._id.toString() : "",
        quantity: ele.qty_in_cart,
        price: ele.price,
        offer_price: ele.offer_price,
      }));
  
      // Price calculation
      let price_details = {
        total_price: 0,
        final_price: 0,
        discount: 0,
        coupon_discount: 0,
      };

      // Setting order price details 
      for(let ele of order_items) { 
        price_details.total_price += ele.price * ele.quantity;
        price_details.final_price += ele.offer_price * ele.quantity;
        price_details.discount += price_details.total_price - price_details.final_price;
      };

      if (cart.coupon?.discount) {
        let coupon_discount = Math.floor( price_details.final_price * cart.coupon.discount/100)

        price_details.discount += coupon_discount
        price_details.final_price -= coupon_discount
        price_details.coupon_discount += coupon_discount
      }

      // Prepare the new order object
      let new_order = {
        user_id: req.session.user_token,
        order_items,
        total_price: price_details.total_price,
        discount_price: price_details.discount ,
        final_price: price_details.final_price,
        coupon:{
          coupon_id:cart.coupon?._id,
          coupon_code:cart.coupon?.coupon_code,
          coupon_discount:price_details.coupon_discount
        },
        address: {
          full_name,
          phone: phone_number,
          pincode,
          state,
          city,
          house,
          road_map,
        },
        
        payment_method: payment_method,

        // payment_id:,  // Save Razorpay Order ID if Razorpay is selected
      };


      async function db_update() {
        
        // Reduce quantity in the Product collection
        for(let ele of order_items) {
          const updated_product = await Product.findOneAndUpdate(
              { _id: ele.product_id, quantity: { $gte: ele.quantity } },
              { $inc: { quantity: - ele.quantity, selling_count: ele.quantity } },
              { new: true }
          );
          if (!updated_product) {
              throw new Error(`Insufficient stock for product ${ele.product_id}`);
          };
        };




        // updating coupon count to database
        if (cart.coupon?.discount) {
          await Coupon.updateOne(
            { _id: cart.coupon._id }, // Find the coupon by its ID
            { 
              $push: { used_user: req.session.user_token }, // Add the user ID to the array
              $inc:  { count: -1 } // Optionally decrement the count
            }
          );
        }

        // Clear the cart after order creation
        await Cart.updateOne(
          {user_id:req.session.user_token},
          { $unset: { products: "", coupon: "" } } // Fields to remove
        ); 
      }


      if (new_order.payment_method === 'Razorpay') {

        const razorpayOrder = await razorpay_instance.orders.create({
          amount: price_details.final_price * 100, // Amount in paise
          currency: 'INR',
          receipt: `order_receipt_${Date.now()}`,
          payment_capture: 1,  // Auto capture payment
        });

        // Add Razorpay order details to the order object
        new_order.payment_id = razorpayOrder.id;
        new_order.razorpay_payment_link = razorpayOrder.short_url; // Optional: can send this to the frontend for payment

        // Insert the new order into the database
        await Order.insertMany([new_order]);

        db_update()
  
        // Return Razorpay order details
        return res.json({ 
          success: true,
          order_id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          payment_link: razorpayOrder.short_url // Optional: return payment link
        });
         
      } else { 
        
        //If the Order Is cash on delivery
        
        //Checking the amount of order to allow COD
        if (new_order.final_price < 1000) {
          return res.json({ 
            success: false ,
            message: `Order amount is below 1000 \n it should not be allowed for COD`
           });
        }

        // Insert the new order into the database
        await Order.insertMany([new_order]);

        db_update()

        return res.json({ 
          success: true ,
        });
      }
    } catch (error) {
      console.error('Error confirming order:', error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    } 
  },
  cofirm_payment:async (req,res)=>{
    try {
      const {payment_id} = req.body
      const razorpay_order_id = req.body.order_id
      let payment_status = false
      await razorpay_instance.payments.fetch(payment_id)
        .then((payment) => {

            console.log('Payment Details:', payment);
            if (payment.status === 'captured') {
                console.log('Payment Successful!');
                payment_status = true

            } else {
                console.log('Payment Not Captured:', payment.status);
                payment_status = false

            }
        })
        .catch((error) => {
            console.error('Error Fetching Payment:', error);
        });
        
      if (payment_status) {
        let new_payment_id = payment_id
        console.log(new_payment_id);
        
        let newone = await Order.updateOne(
          {payment_id:razorpay_order_id},
          {$set:{payment_id:new_payment_id,payment_status:'Completed'}}
        );

        return res.json({ 
          success: true ,
          message:'payment successfully completed'
        });

      } else {

        await Order.updateOne(
          {payment_id:razorpay_order_id},
          {$set:{payment_status:'Failed' }}
        );
        return res.json({ 
          success: false
        });
      }

    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },

  show_order_success: (req, res) => {
    try {
      res.render("user/order_success", {
        active_page: "",
      });
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },
  show_order_failed: (req, res) => {
    try {
      res.render("user/order_failed", {
        active_page: "",
      });
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },
  show_orders: async (req, res) => {
    try {
      let orders = await Order.find({user_id:req.session.user_token}).populate('order_items.product_id');
      orders.reverse();
  
      res.render("user/orders", {
        active_page: "pages",
        orders,
      });
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },
  show_order_details: async (req, res) => {
    try {
      let order_id = req.query.id
      let order = await Order.findOne({_id:order_id}).populate('order_items.product_id');
      // console.log(order);
      
      res.render("user/order_details", {
        active_page: "pages",
        order,
      });
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  },
  rate_product: async (req, res) => {
    try {
      const { product_id, rating } = req.body;

      // Update the product's rating (e.g., average rating logic can be implemented)
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(httpStatusCode.NOT_FOUND).json({ success: false, message: 'Product not found' });
      }
   
      // Example: Replace the existing rating with the new rating
      // product.rating = (product.rating + rating ) / 2; 
      product.rating = rating
      await product.save();
  
      res.json({ success: true, message: 'Rating updated successfully' });
    } catch (error) {
      console.error('Error updating rating:', error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to update rating' });
    }
  },


  update_order_status: async (req,res)=>{
    try {
      let {status} = req.body

      if (status == 'Cancel' || status == 'Return' ) {

        if (status == 'Cancel') {
          reason  = 'onnulla oru rasam'
          await Order.updateOne({_id:req.body.id},{$set:{status:'Cancelled'}})
          
        }

        if (status == 'Return') {
          let {reason} = req.body
          await Order.updateOne({_id:req.body.id},{$set:{status:'Requesting Return',returning_reason : reason}})
          
        }



        return res.json({
          success:true,
          message: ` order ${status}`
        })
      }else{
        return res.json({
          success:false,
          message: " somthing when wrong "
        })
      }
      // console.log(order);

    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ 
        success:false,
        message: "Internal server error"
       });
    }
  }, 
  generate_invoice : async (req, res) => {
    try {
        const { order_id } = req.query;
        console.log(order_id);

        // Fetch the order details using orderId
        const orders = await Order.findOne({ order_id:order_id }).populate('order_items.product_id');
        console.log(orders);
        
        if (!orders) {
            return res.status(httpStatusCode.NOT_FOUND).send('Order not found');
        }
        
        const invoice_path = path.join(__dirname, '../../views/user/invoice.ejs');
        const invoice_html = await renderFile(invoice_path, { orders });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(invoice_html);


        const pdf_buffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order_id}.pdf`);
 
        res.end(pdf_buffer);

    } catch (error) {
        console.log('Error generating invoice:', error);
        res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send('Error generating invoice');
    }
},



  show_wishlist:async (req,res)=>{
    try {
      let wishlist = await Wishlist.findOne({user_id:req.session.user_token}).populate('products.product_id');  
      
      res.render("user/wishlist", {
        active_page: "pages",
        products:wishlist?.products ?? [],
      });  
         
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ 
        success:false,
        message: "Internal server error"
       });
    }
  },
  add_to_wishlist:async (req,res)=>{
    try {
      let product_id = req.body.product_id;
      let new_wishlist = {
        user_id: req.session.user_token,
        products: [
          {
            product_id: product_id,
          },
        ],
      };

      let user_wishlist = await Wishlist.findOne({ user_id: req.session.user_token });

      if (user_wishlist) {
        // Check if the product already exists in the wishlist
        const product_exists = user_wishlist.products.some(
          (item) => item.product_id.toString() === product_id
        );

        if (!product_exists) {
          // Add the product to the wishlist
          await Wishlist.updateOne(
            { user_id: req.session.user_token },
            { $addToSet: { products: { product_id: product_id } } } // Correct field and value
          );
          console.log("Product added to existing wishlist");

          return res.status(httpStatusCode.OK).json({ 
            success:true,
            message: "added"
           });

        } else {
          console.log("Product already exists in wishlist");

          return res.status(httpStatusCode.OK).json({ 
            success:false,
            message: "existed"
           });
        }
      } else {
        console.log("No wishlist found for user, creating a new one");
        // Create a new wishlist
        await Wishlist.create(new_wishlist);

        return res.status(httpStatusCode.OK).json({ 
          success:true,
          message: "created"
         });
      }
      
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ 
        success:false,
        message: "Internal server error"
       });
    }
  },
  remove_from_wishlist:async (req,res)=>{
    try {

      let product_id = req.query.id
      let user_id = req.session.user_token
     
   await Wishlist.updateOne(
      { user_id: user_id },
      { $pull: { products: { "product_id": product_id } } }
    );
      
      return res.status(httpStatusCode.OK).json({ 
        success:true,
        message: "product removed from wishlist"
      });
    
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ 
        success:false,
        message: "Internal server error"
       });
    }
  },
  show_wallet:async (req,res)=>{
    try {
      let wallet = await Wallet.findOne({user_id:req.session.user_token}) 
      
      res.render("user/wallet", {
        active_page: "pages",
        wallet: wallet || {},
      });
         
    } catch (error) {
      console.error("Error :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ 
        success:false,
        message: "Internal server error"
       });
    }
  },
};
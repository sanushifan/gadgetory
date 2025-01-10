const bcrypt = require("bcrypt");
const Product = require("../../models/product_model");
const httpStatusCode = require("../../utils/http_status_codes");
const User = require("../../models/user_model");
const Order = require("../../models/order_model");
const Coupon = require("../../models/coupon_model");
const Category = require("../../models/category_model");
const Cart = require("../../models/cart_model");
const Wallet = require("../../models/wallet_model");

module.exports = {
  logout: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("admin/login");
    } catch (err) {
      console.error("Error in Logout:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: '"Internal sever Error"',
        });
    }
  },

  show_adminpanel:async (req, res) => {
    try {
      let orders = await Order.aggregate([
        {
          $project: {
            _id:0,
            final_price: "$final_price",
            discount_price: "$discount_price",
            coupon_discount: "$coupon.coupon_discount",
            order_date:"$order_date",
            category:"$category",
            brand:"$brand",
            product_name:"$product_name",
          }
        }
      ]);
      // console.log(orders);

      res.status(httpStatusCode.OK).render("admin/adminpanel", {
        active_page: "adminpanel",
        orders
      });
    } catch (error) {
      console.error("Error in adminpanel :", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR)
         .json({ 
            success:false,
            status: "Failed",
            message: 'admin redering Failed'
         });
    }
  },
  get_sales_report:async (req, res) => {
    try {
      let orders = await Order.find()
      
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: true,
          orders,
          message: 'sales report is sended',
        });
    } catch (err) {
      console.error("Error in fatching Report:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: '"Internal sever Error"',
        });
    }
  },
  show_product_manage: async (req, res) => {
    try {
        let product_data = await Product.find().populate({path:'category',select:'category_name -_id'})


        res.render("admin/product_manage", {
          active_page: "product_manage",
          products: product_data,
        }); 

    } catch (err) {
        console.error("Error in show product manage:", err);
        return res
          .status(httpStatusCode.INTERNAL_SERVER_ERROR)
          .json({
            success: false,
            message: '"Internal sever Error"',
          });
    }
  },

  show_add_product:async (req, res) => {
    try {
      let category = await Category.find(
        {is_deleted:false},
        {category_name:1}
      )
      // console.log(category);
      
      res.render("admin/add_product", {
        active_page: "product_manage",
        category,
      });
    } catch (err) {
      console.error("Error in show add product :", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: '"Internal sever Error"',
        });
}

  },

  add_product: async (req, res) => {
    try {
      if (!req.files) {
        console.log("not getting");
        return res
          .status(httpStatusCode.OK)
          .json({ status: false, message: "Product image uploading Failed" });
      }
 
      const category_id = req.body.category.split(",");
      console.log(category_id);
      
      const image_file_names = req.files.map((file) => file.filename);
      
      const new_product = new Product({
        product_name: req.body.product_name,
        brand: req.body.brand,
        size: req.body.size,
        color: req.body.color,
        category: category_id,
        quantity: req.body.quantity,
        material: req.body.material,
        price: req.body.price,
        offer_price: req.body.offer_price,
        description: req.body.description,
        images: image_file_names,
      });

      await new_product.save();

      return res
        .status(httpStatusCode.OK)
        .json({ status: "success", message: "Product image uploading success" });
    } catch (err) {
      console.error("Error saving product:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Product uploading Failed"' });
    }
  },
  show_edit_product: async (req, res) => {
    try {
      let category = await Category.find(
        {is_deleted:false},
        {category_name:1}
      ) 
      // console.log(category);    

      let product_id = req.query.id;
      let product = await Product.findById(product_id).populate({path:'category',select:'category_name _id'})
      console.log(product);

      res.render("admin/edit_product", {
        active_page: "product_manage",
        product,
        category,
      });
    } catch (err) {
      console.error("Error in show product manage:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: '"Internal sever Error"',
        });
    }
  },

  edit_product: async (req, res) => {
    try {
      if (!req.files) {
        console.log("not getting");
        return res
          .status(httpStatusCode.OK)
          .json({ status: false, message: "Product image uploading Failed" });
      }

      let product_id = req.body.product_id;

      const product = await Product.findById(product_id);
      if (!product) {
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ 
            success:false,
            
            message: "product is unable to found"
           });
      } else {

        const image_file_names = req.files.map((file) => file.filename);
        const array_category = req.body.category.split(",");
        console.log(image_file_names);
        console.log(array_category);

        product.product_name = req.body.product_name || product.product_name;
        product.brand = req.body.brand || product.brand;
        product.size = req.body.size || product.size;
        product.color = req.body.color || product.color;
        product.category = array_category || product.category;
        product.quantity = req.body.quantity || product.quantity;
        product.material = req.body.material || product.material;
        product.price = req.body.price || product.price;
        product.offer_price = req.body.offer_price || product.offer_price;
        product.description = req.body.description || product.description;

        if (req.files.length <= 0) {
          product.images = product.images;
        } else {
          product.images = image_file_names;
        }

        await product.save();

        return res
          .status(httpStatusCode.OK)
          .json({ 
            success:true,
            message: 'User updated successfully',
           });
      }
    } catch (err) {
      console.error("Error saving product:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Product uploading Failed"' });
    }
  },

  delete_product: async (req, res) => {
    try {
      let product_id = req.body.id
      if (req.body.is_deleted) {
        await Product.updateOne(
          { _id: product_id },
          { $set: { is_deleted: false } }
        );
      } else {
        await Product.updateOne(
          { _id: product_id },
          { $set: { is_deleted: true } }
        );
        await Cart.updateMany(
          {'products.product_id': product_id},
          {$pull:{products:{product_id}}}
        )
      }
    } catch (err) {
      console.error("Error in  Product status updating:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: 'Product status updating Failed' });
    }

  },




  show_user_manage: async (req, res) => {
    try {
      let user = await User.find({
        $and: [{ is_deleted: false }, { is_blocked: false }],
      });
      let is_blocked = await User.find({ is_blocked: true });
      res.render("admin/user_manage", {
        active_page: "user_manage",
        user: user,
        blocked_user: is_blocked,
      });
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },

  show_edit_user: async (req, res) => {
    try {
      const user_id = req.query.id;
      const user = await User.findById(user_id);
      res.render("admin/edit_user", {
        active_page: "user_manage",
        user: user,
      });
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  }, 
  edit_user: async (req, res) => {
    try {
      const user_id = req.params.id;
      const user = await User.findById(user_id);
      if (!user) {
        return res
          .status(httpStatusCode.NOT_FOUND)
          .json({ message: "User not found" });
      } else {
        user.first_name = req.body.first_name || user.first_name;
        user.last_name = req.body.last_name || user.last_name;
        user.phno_number = req.body.phno_number || user.phno_number;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        await user.save();

        res
          .status(httpStatusCode.OK)
          // .json({ message: 'User updated successfully', user });
          .redirect("/admin/user_manage");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
  },

  // delete_user: async (req, res) => {
  //   // console.log(req.query.id);
  //   try {
  //     await User.updateOne(
  //       { _id: req.query.id },
  //       { $set: { is_deleted: true } }
  //     );
  //     res.redirect("/admin/user_manage");
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     res
  //       .status(httpStatusCode.INTERNAL_SERVER_ERROR)
  //       .json({ message: "Server error", error });
  //   }
  // },

  block_user: async (req, res) => {
    // console.log(req.query.id)
    try {
      let user = await User.findById(req.query.id);
      let block_status = !user.is_blocked;
      await User.updateOne(
        { _id: req.query.id },
        { $set: { is_blocked: block_status } }
      );
      res.redirect("/admin");
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Server error", error });
    }
  },

  // get_edit_product_id: async (req, res) => {
  //   let product_id = req.query.id;
  //   let product = await Product.findById(product_id);
  //   console.log(product);

  //   res.json({ category: product.category });
  // },


  show_orders: async (req, res) => {

    const { page = 1, limit = 10 } = req.query;

    try {
        let skip_count = (page - 1) * limit 
        const orders = await Order.find().populate("order_items.product_id").sort({order_date:-1})
            .skip(skip_count>0?skip_count:0) // Skip items from previous pages
            .limit(parseInt(limit)) // Limit results per page
            .exec();
 
        const count = await Order.countDocuments();
  
        res.render("admin/orders", {
          active_page: "orders",
          orders,
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
        });
      } catch (err) {
        console.error("Error rendering Orders:", err);
        res
          .status(httpStatusCode.INTERNAL_SERVER_ERROR)
          .json({ status: "Failed", message: '"Order managemnnt page Failed"' });
      }
  },
  show_update_order: async (req, res) => {
    try {
      let order = await Order.findOne({ _id: req.query.id }).populate(
        "order_items.product_id"
      );
      // console.log(order);

      res.render("admin/update_order", {
        active_page: "orders",
        order,
      });
    } catch (err) {
      console.error("Error saving product:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Internal sever Error"' });
    }
  },
  update_order: async (req, res) => {
    try {

      let { order_id, selected  } = req.body;
        
      if( selected == 'Returned'){
        let order = await Order.findOne({_id:order_id})
        let order_price = order.final_price
        let wallet = await Wallet.findOne({user_id: order.user_id})
        if (wallet) {
          await Wallet.updateOne({user_id : order.user_id},{$inc:{balance: order_price }})
        }else{
          await Wallet.insertMany([{
            user_id:order.user_id,
            balance:order_price,
          }]);
        } 
      }
      if (selected ==='Delivered') {
        await Order.updateOne({ _id: order_id }, { $set: { status: selected , payment_status:'Completed' } });
      }else{
        await Order.updateOne({ _id: order_id }, { $set: { status: selected } });
      }

      return res.status(httpStatusCode.OK).json({
        success: selected,
      });

    } catch (err) {
      console.error("Error saving product:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: 'Order update page Failed' });
    }
  },

  show_coupons: async (req, res) => {
    try {
      let coupons = await Coupon.find({is_active:true});
      // console.log(coupons);

      res.render("admin/coupons", {
        active_page: "coupons",
        coupons,
      }); 
    } catch (err) {
      console.error("Error saving product:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Internal sever Error"' });
    }
  },
  
  inactivate_coupon: async (req, res) => {
    try {
      await Coupon.updateOne({_id:req.body.id},{$set:{is_active: false}})

      return res.json({
        success: true,
      });
    } catch (err) {
      console.error("Error saving product:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ 
          success:false,
          status: "Failed", 
          message: 'Internal sever Error'
         });
    }
  },
  show_add_coupon: async (req, res) => {
    try {
      res.render("admin/add_coupon", {
        active_page: "coupons",
      });
    } catch (err) {
      console.error("Error saving product:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Internal sever Error"' });
    }
  },
  add_coupon: async (req, res) => {
    try {

      
      let data = {
        coupon_code: req.body.coupon_code.toUpperCase(),
        discount: req.body.discount,
        expiry_date: req.body.expiry_date,
        count: req.body.count,
        min_purchase_: req.body.min_purchase_value,
      };
      data.coupon_code = data.coupon_code.toUpperCase()
      console.log(data);
      await Coupon.insertMany([data]);
      
      return res
        .status(httpStatusCode.OK)
        .json({
          success: true,
          status: "Failed",
          message: "coupon added successfully",
        });

    } catch (err) {
      console.error("Error saving product:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          status: "Failed",
          message: '"Internal sever Error"',
        });
    }
  },
  show_offers: async (req, res) => {
    try {
      res.render("admin/offers", {
        active_page: "offers",
      });
    } catch (err) {
      console.error("Error in show offers:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '" Rendering page Failed"' });
    }
  },
  show_category: async (req, res) => {
    try {
      let category = await Category.find({is_deleted:false})
      let deleted_category = await Category.find({is_deleted:true})
      res.render("admin/category", {
        active_page: "category",
        category  ,
        deleted_category,
      });
    } catch (err) {
      console.error("Error in show category:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Rendering page Failed"' });
    }
  },
  show_add_category: async (req, res) => {
    try {
      res.render("admin/add_category", {
        active_page: "category",
      });
    } catch (err) {
      console.error("Error showing add-category:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Internal sever Error"' });
    }
  },
  add_category: async (req, res) => {
    try {
      let data = {
        category_name: req.body.category_name,
        category_offer: req.body.category_offer,
        description: req.body.description,
      };
      console.log(data);
      await Category.insertMany([data]);
      
      return res
        .status(httpStatusCode.OK)
        .json({
          success: true,
          message: "category added successfully",
        });
    } catch (err) {
      console.error("Error saving product:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: '"Internal sever Error"',
        });
    }
  }, 
  show_edit_category: async (req, res) => {
    try {
      let category = await Category.findOne({_id:req.query.id})
      res.render("admin/edit_category", {
        active_page: "category",
        category,
      });
    } catch (err) {
      console.error("Error showing add-category:", err);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ status: "Failed", message: '"Internal sever Error"' });
    }
  },

  edit_category: async (req, res) => {
    try {
      let category_id = req.body.id
 
      let data={
        category_name: req.body.category_name,
        category_offer: req.body.category_offer,
        description: req.body.description,
      }

      
      await Category.updateOne(
        { _id: category_id },
        { $set: data }
      );
      console.log('edited');
      
      return res
      .status(httpStatusCode.OK)
      .json({ success: true });

    } catch (err) {
      console.error("Error saving product:", err);
      return res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: '"Internal sever Error"',
        });
    }
  },
  delete_category: async (req, res) => {
    try {
      let category_id = req.body.id
      let is_deleted = req.body.is_deleted
      await Category.updateOne(
        { _id: category_id },
        { $set: { is_deleted: is_deleted } }
      );
      console.log('deleted');
      
      return res
      .status(httpStatusCode.OK)
      .json({ success: true });

    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ success:false, message: "Server error", error });
    }
  },

  graph_report : async (req, res) => {
    try {

      const { duration } = req.query;

      const string_to_date = (duration) => {
        if (duration === 'day') {
            return new Date(Date.now() - (1000 * 60 * 60 * 24));
        } else if (duration === 'week') {
            return new Date(Date.now() - (1000 * 60 * 60 * 24 * 7));
        } else if (duration === 'month') {
            return new Date(Date.now() - (1000 * 60 * 60 * 24 * 31));
        } else if (duration === 'month') {
            return new Date(Date.now() - (1000 * 60 * 60 * 24 * 31 * 365));
        }
      }; 

      const date = string_to_date(duration);

      const top_selling_products = await Product.find({is_deleted:false}).sort({ selling_count: -1 }).limit(10).populate('category');
      const top_selling_categorys = await Category.find({is_deleted:false}).sort({ sales_count: -1 }).limit(10)
      const top_selling_brands = await Product.aggregate([
          { $match: { brand: { $ne:null } } },
          { 
              $group:{
                    _id: "$brand", 
                    totalSales : { $sum: '$selling_count' } 
              }
          },
          { $sort: { totalSales: -1 } },
          { $limit:10}
      ])
      // console.log(top_selling_brands);
      
      return res.status(200).json({ 
        top_selling_products, 
        top_selling_categorys,
        top_selling_brands
      })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'something went wrong' })
    }
  }

};

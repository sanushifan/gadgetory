const express = require('express');

const router = express.Router();
const admin_controller = require('../controllers/admin/admin_controller');
const admin_auth_controller = require('../controllers/admin/admin_auth_controller');
const upload =require('../middlewere/upload_files')
const admin_token_check = require('../middlewere/admin_auth')



//////////////////////////////////////////////////////////////////////////

// Admin login
router.get('/login', admin_auth_controller.show_login);
router.post('/login', admin_auth_controller.login);  

// Admin logout
router.get('/logout', admin_token_check,admin_controller.logout);

// adminpanel
router.get('/adminpanel', admin_token_check,admin_controller.show_adminpanel); 
router.get('/graph_report', admin_token_check,admin_controller.graph_report); 


// Admin product manage
router.get('/product_manage', admin_token_check,admin_controller.show_product_manage);

//  product add , edit , delete
router.get('/add_product', admin_token_check,admin_controller.show_add_product);
router.post('/add_product', admin_token_check ,upload, admin_controller.add_product);

router.get('/edit_product', admin_token_check,admin_controller.show_edit_product);
router.post('/edit_product', admin_token_check ,upload, admin_controller.edit_product);
router.post('/delete_product', admin_token_check,admin_controller.delete_product);


// Admin User Management
router.get('/user_manage', admin_token_check, admin_controller.show_user_manage);
router.get('/edit_user', admin_token_check, admin_controller.show_edit_user);
router.post('/edit_user/:id', admin_token_check, admin_controller.edit_user);
router.get('/block_user', admin_token_check, admin_controller.block_user);

// Order Manage
router.get('/orders', admin_token_check, admin_controller.show_orders);
router.get('/update_order', admin_token_check, admin_controller.show_update_order);
router.post('/update_order', admin_token_check, admin_controller.update_order);

// Coupons Manage
router.get('/coupons', admin_token_check, admin_controller.show_coupons);
router.get('/add_coupon', admin_token_check, admin_controller.show_add_coupon);
router.post('/add_coupon', admin_token_check, admin_controller.add_coupon);
router.post('/inactivate_coupon', admin_token_check, admin_controller.inactivate_coupon);

// Offer Manage
router.get('/offers', admin_token_check, admin_controller.show_offers);

//Category Manege
router.get('/category', admin_token_check, admin_controller.show_category);
router.get('/add_category', admin_token_check, admin_controller.show_add_category);
router.post('/add_category', admin_token_check, admin_controller.add_category);
router.get('/edit_category', admin_token_check, admin_controller.show_edit_category);
router.post('/edit_category', admin_token_check, admin_controller.edit_category);
router.post('/delete_category', admin_token_check, admin_controller.delete_category);



// Fetching Data
router.get('/get_sales_report', admin_token_check, admin_controller.get_sales_report);

module.exports = router;
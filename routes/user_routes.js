const express = require('express');
const passport = require("passport");
const router = express.Router();
const user_controller = require('../controllers/user/user_controller');
const user_auth_controller = require('../controllers/user/user_auth_controller');
const authentication = require('../controllers/user/external_authentication');
const user_token_check = require('../middlewere/user_auth')

router.get('/', user_auth_controller.empty);

// User signup 
router.get('/signup', user_auth_controller.show_signup);
router.post('/signup', user_auth_controller.signup);

// User login 
router.get('/login', user_auth_controller.show_login);
router.post('/login', user_auth_controller.login);

// User forgott password 
router.get('/forgot_password', user_auth_controller.show_forgot_password);
router.post('/forgot_password', user_auth_controller.forgot_password);
router.post('/password_otp_verify', user_auth_controller.password_otp_verify);
router.post('/new_password', user_auth_controller.new_password);

// User  otp verification 
router.get('/otp_verification', user_auth_controller.show_otp_verification);
router.post('/otp_verification', user_auth_controller.otp_verification);
router.get('/send_otp', user_auth_controller.send_otp);
router.get('/get_otp_timer', user_auth_controller.get_otp_timer);

// Google authentication
router.get('/auth/google', authentication.auth_google);
router.get('/auth/google/callback',authentication.google_callback, authentication.auth_google_callback);


///////////////////////////////////////////////////////////////////////////////////////////////

router.get('/get_badge_counts',user_token_check, user_controller.get_badge_counts);

// User hompage route
router.get('/homepage',user_token_check, user_controller.show_homepage);

// User Logout
router.get('/logout',user_token_check, user_controller.logout);

// User shop
router.get('/shop',user_token_check, user_controller.show_shop);
router.get('/quick_sort',user_token_check, user_controller.quick_sort);


//User Product Details
router.get('/product_details',user_token_check, user_controller.product_details);


//User Profile Details
router.get('/profile',user_token_check, user_controller.show_profile);
router.post('/edit_user_detail',user_token_check, user_controller.edit_user_detail);
router.post('/reset_password',user_token_check, user_controller.reset_password);
router.get('/profile_address',user_token_check, user_controller.show_profile_address);
router.post('/add_address',user_token_check, user_controller.add_address);
router.post('/edit_address',user_token_check, user_controller.edit_address);
router.delete('/delete_address/:id',user_token_check, user_controller.delete_address);


//User Cart Details
router.get('/shopping_cart',user_token_check, user_controller.show_shopping_cart);
router.post('/add_to_cart',user_token_check, user_controller.add_to_cart);
router.delete('/delete_cart/:id',user_token_check, user_controller.delete_cart);
router.post('/update_cart',user_token_check, user_controller.update_cart);
router.post('/coupon_check',user_token_check, user_controller.coupon_check);


//User checkout Details
router.get('/checkout',user_token_check, user_controller.show_checkout);
router.post('/confirm_order',user_token_check, user_controller.confirm_order);

router.post('/cofirm_payment',user_token_check, user_controller.cofirm_payment);
router.get('/order_success',user_token_check, user_controller.show_order_success);
router.get('/order_failed',user_token_check, user_controller.show_order_failed);


//User Order History Details
router.get('/orders',user_token_check, user_controller.show_orders);
router.get('/order_details',user_token_check, user_controller.show_order_details);
router.post('/update_order_status',user_token_check, user_controller.update_order_status);
router.post('/rate_product',user_token_check, user_controller.rate_product);
router.get('/invoice',user_token_check, user_controller.generate_invoice);

 

// User Wishlist Details
router.get('/wishlist',user_token_check, user_controller.show_wishlist);
router.post('/add_to_wishlist',user_token_check, user_controller.add_to_wishlist);
router.get('/fetch_wishlist',user_token_check, user_controller.fetch_wishlist);


router.post('/remove_from_wishlist',user_token_check, user_controller.remove_from_wishlist);

// User Wishlist Details
router.get('/wallet',user_token_check, user_controller.show_wallet);

  



module.exports = router;

const bcrypt = require('bcryptjs');
// const crypto = require('crypto');
// const {sendOTPEmail,generateOTP} = require('./otp_controller')
const Admin = require('../../models/admin_model');
const httpStatusCode = require('../../utils/http_status_codes');

module.exports = {

    // Show login form
   show_login: (req, res) => {
       if (!req.session.admin_token) {

           res.status(httpStatusCode.NOT_FOUND).render('admin/admin_login') 
       }else {
           res.redirect("/");
       }
   },
   // Log in admin
   login: async (req, res) => {
       try {
           const { email, password } = req.body;
           console.log(email,password);
           const user = await Admin.findOne({ email });
           if (user && await bcrypt.compare(password, user.password)) {
               req.session.admin_token = true
               res.redirect("admin/adminpanel") 
           } else {
               res.status(400).send("Invalid email or password");
           }
       } catch (error) {
           res.status(500).send(error.message);
       }
   },

}

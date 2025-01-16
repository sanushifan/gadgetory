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
      console.log(email, password);
      const user = await Admin.findOne({ email });
   
      if (user && (await bcrypt.compare(password, user.password))) {
        req.session.admin_token = true
        console.log("logged",req.session.admin_token);


        return res.status(httpStatusCode.OK).json({
          success: true,
          redirect_url: 'admin/adminpanel' 
        });
      } else {
        return res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message:"Invalid email or password"
        });
      }
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },

}

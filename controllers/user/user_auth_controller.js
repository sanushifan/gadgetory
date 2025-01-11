const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { sendOTPEmail, generateOTP } = require("../../helper/node_mailer");
const User = require("../../models/user_model");
const httpStatusCode = require("../../utils/http_status_codes");


module.exports = {
  empty: (req, res) => {
    try {
      if (req.session.user_token) {
        res.redirect("/homepage");
      } else if (req.session.admin_token) {
        res.redirect("/admin/adminpanel");
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
  // Show signup form
  show_signup: (req, res) => {
    if (!req.session.admin_token && !req.session.user_token) {
      res.render("user/signup");
    } else {
      res.redirect("/");
    }
  },
  // Signup user
  signup: async (req, res) => {
    try {
      const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phno_number: req.body.phno_number,
        email: req.body.email,
        password: req.body.password,
        is_deleted: false,
        is_blocked: false,
      };
      req.session.user_data_status = true;
      const user_email = await User.findOne({ email: data.email });

      if (user_email) {
        return res.status(httpStatusCode.CONFLICT).json({
          success: false,
          
        });
        
      } else {
        data.password = await bcrypt.hash(data.password, 10);
        req.session.user_signup_data = data;
        return res.status(httpStatusCode.OK).json({
          success: true,
          redirect_url: "/send_otp"
        });

      }
    } catch (error) {
      console.log(error);
      
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },

  // Show login form
  show_login: (req, res, next) => {
    if (!req.session.admin_token && !req.session.user_token) {
      res.render("user/login");
    } else {
      res.redirect("/");
    }
  },

  // Log in user  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const user = await User.findOne({ email , is_blocked:false});
   
      if (user && (await bcrypt.compare(password, user.password))) {
        req.session.user_token = user._id
        console.log("logged",req.session.user_token);


        return res.status(httpStatusCode.OK).json({
          success: true,
          redirect_url: '/homepage' 
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

  // Show forgot password form
  show_forgot_password: (req, res) => {
    if (!req.session.admin_token && !req.session.user_token) {

      res.render("user/forgot_password");
    } else {
      res.redirect("/");
    }
  },

  // Handle forgot password
  forgot_password: async (req, res) => {
    try {
      
      const { email } = req.body;
    
      const user = await User.findOne({ email });
      if (user) {
        let otp = generateOTP();
        await sendOTPEmail(email, otp);
        req.session.otp = otp;
        req.session.email = email
        
        return res.status(httpStatusCode.OK).json({
          success:true,
          message:"otp Sended To Email"
        });
      } else {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success:false,
          message:"No account found with that email"
        });
      }  
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
  password_otp_verify:async (req,res)=>{
    try {
      const { otp } = req.body;


      if (req.session.otp === otp ) {
        delete req.session.otp;
        req.session.otp_verify = true ;

        console.log("otp verifyed");
        return res.status(httpStatusCode.OK).json({
            success:true,
            message:"otp verification success"
        });
      } else {

        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success:false,
          message:"otp verification failed"
        });
      }
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },
  new_password:async(req,res)=> {
    try {
      console.log("new pass setting");

      let {password} = req.body
      hashed_password = await bcrypt.hash(password, 10);n 

      if (req.session.otp_verify) {
        await User.updateOne({email:req.session.email},{$set:{password:hashed_password}})
        delete req.session.email;
        delete req.session.otp_verify;
        console.log("pass verifyed");
        
        return res.status(httpStatusCode.OK).json({
          success:true,
          message:"password success"
        });

      }else{
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success:false,
          message:"otp verification failed"
        });
      }
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(error.message);
    }
  },

  send_otp: async (req, res) => {
    try {
      const user_email = req.session.user_signup_data.email;
      if(user_email){
        console.log(user_email);
        let otp = generateOTP();
        await sendOTPEmail(user_email, otp);
        req.session.otp = otp;
        console.log(req.session.otp);
  
        res.redirect("otp_verification");
      }
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({ message: "Failed to send OTP." });
    }
  }, 
  get_otp_timer: (req, res, next) => {
    try {
      let countdown = 10;

      let interval = setInterval(function() {
          console.log(countdown)
          countdown--;
          if (countdown < 0) {
              clearInterval(interval); 
              console.log("Countdown finished!");
          }
      }, 1000); 
    } catch (error) {
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send({ message: "Failed to send OTP." });
    }
  },

  show_otp_verification: (req, res) => {
    if (!req.session.admin_token && !req.session.user_token) {
      res.render("user/otp_verification");
    } else {
      res.redirect("/");
    }
  },

  otp_verification: async (req, res) => {
    let otp = req.session.otp; // OTP stored in session
    let user_data = req.session.user_signup_data;
    console.log("OTP from session:", otp);

    try {
      if (req.body.otp === otp) {
        console.log("OTP verified successfully! " ,user_data);

        if (req.session.user_data_status == true) {
          delete req.session.user_data_status;
          delete req.session.otp;
          console.log("user data added to database");
          await User.insertMany([user_data]);
        }
        return res.json({
          success: true,
          message: "OTP verified successfully!",
        });
      } else {
        return res.json({
          success: false,
          message: "OTP verification failed!",
        });
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.message);

      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },


};

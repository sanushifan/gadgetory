require("dotenv").config();
const express = require("express");
const passport = require("passport");
const User = require("../../models/user_model");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express()
const httpStatusCode = require('../../utils/http_status_codes');


app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        return done(null, profile);
      }
    )
  );

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports={

    auth_google: passport.authenticate("google", { scope: ["profile", "email"] 
        }),

    google_callback:passport.authenticate("google", { failureRedirect: "/login" }),

    auth_google_callback: async(req, res) => {
            try {

              let data = {
                first_name : req.user.name.givenName,
                last_name: req.user.name.familyName,
                phno_number: null,
                email:  req.user.emails[0].value,
                password: null,
                is_deleted: false,
                is_blocked: false,
              }
                
                let email = data.email
                const user = await User.findOne({email})
                if (!user) {
                    await User.insertMany([data])
                    let user = await User.findOne({email})
                    req.session.user_token = user._id;
                    res.redirect("/homepage");
                }else{         
                    
                    req.session.user_token = user._id;
                    res.redirect("/homepage");
                }
            } catch (error) {
                res.status(500).send(error.message);
            }          
  }
}
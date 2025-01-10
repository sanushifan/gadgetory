const express = require("express");

// Cheking user is logged
module.exports = admin_token_check = (req, res, next) => {
  if (req.session.admin_token) {
    next();
  } else {
    // next();
    res.redirect("/")
  }
};

const express = require("express");

module.exports = user_token_check = (req, res, next) => {
  if (req.session.user_token) {
    next();
  } else {
    res.redirect("/")
  }
};

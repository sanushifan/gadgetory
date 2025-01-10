const express = require("express");

module.exports = user_token_check = (req, res, next) => {
  if (req.session.user_token) {
    // req.session.user_token = "67349af1c25d08422ae580d3";
    next();
  } else {
    // req.session.user_token = "67349af1c25d08422ae580d3";
    next();
    res.redirect("/")
  }
};

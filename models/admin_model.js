const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  phno_number: String,
  email: String,
  password: String,
});

const admin = mongoose.model("admins", adminSchema);
module.exports = admin;

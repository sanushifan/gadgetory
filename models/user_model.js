const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    phno_number: String,
    email: String,
    password: String,
    referral_code:{
        type:String,
        default:() => uuidv4().replace(/-/g, '').substring(0, 6).toUpperCase(),
        unique:true
      },
    is_deleted:Boolean,
    is_blocked:Boolean,

});

const User = new mongoose.model('User', userSchema);
module.exports = User;

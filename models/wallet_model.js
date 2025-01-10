const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId, 
    ref: 'User', 
    required: true 
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0 
  },
//   transactions: [
//     {
//       type: { 
//         type: String, 
//         enum: ['credit', 'debit'],
//         required: true 
//       },
//       amount: {
//         type: Number,
//         required: true,
//         min: 0 
//       },
//       date: {
//         type: Date,
//         default: Date.now
//       },
//       description: {
//         type: String,
//         default: '' 
//       },
//       status: {
//         type: String,
//         enum: ['successs','failed'],
//         default: 'successs'
//       }
//     }
//   ]
},
{
    timestamps:true
});


const Wallet =  mongoose.model('Wallet', walletSchema);

module.exports = Wallet;

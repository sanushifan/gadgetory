

require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
.then(() => {
    console.log("Database connected successfully!");
})
.catch((error) => {
    console.log("Database connection failed:", error);
});

module.exports = mongoose;

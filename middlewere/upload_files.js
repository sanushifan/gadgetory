const multer = require("multer");
const path = require("path");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Set up Multer with file size limit and storage options
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).array("product_image", 4);

module.exports = upload;

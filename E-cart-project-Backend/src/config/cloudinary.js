const cloudinary = require("cloudinary").v2;
const path             = require('path');
const dotenv           = require('dotenv');
dotenv.config({path:path.join(__dirname,'../../.env')});

// console.log('6',process.env.CLOUDINARY_API_KEY)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
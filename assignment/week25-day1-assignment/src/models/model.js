const mongoose = require("mongoose")


const Blogschema = new mongoose.Schema({
  name      : String,
  email     : String,
  password  : String,
  default   : Date
});


const blog = mongoose.model('Blog',Blogschema)

module.exports = blog;
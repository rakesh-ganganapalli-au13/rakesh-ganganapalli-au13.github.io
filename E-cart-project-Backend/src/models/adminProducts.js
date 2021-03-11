const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    title        : {type : String, required:true},
    slug         : {type : String},
    category     : {type : String,required:true},
    price        : {type : Number,required:true},
    image        : {type :String},
    discription  : {type : String, required:true},
    img_url      : {type : String}, //for saving url where image is saved cloud
    cloudinary_id : {type : String } //used for updaing the product image in cloudinary
});


module.exports = mongoose.model('product',productSchema)
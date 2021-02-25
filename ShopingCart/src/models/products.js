const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    title       : {type : String, required:true},
    slug        : {type : String},
    category    : {type : String,required:true},
    price       : {type : Number,required:true},
    image       : {type:String},
    discription : {type : String, required:true}
});


module.exports = mongoose.model('product',productSchema)
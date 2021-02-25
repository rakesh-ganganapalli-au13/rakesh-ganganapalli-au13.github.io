const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    title   : {type : String, required:true},
    slug    : {type : String}
});


module.exports = mongoose.model('category',categorySchema)
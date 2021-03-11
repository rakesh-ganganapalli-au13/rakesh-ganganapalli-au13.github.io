const mongoose = require('mongoose');



const signUpSchema = mongoose.Schema({
    name     : {type:String,require:true},
    email    : {type:String,require:true},
    phone    : {type:Number},
    password : {type:String}
})



module.exports = mongoose.model('Users',signUpSchema);
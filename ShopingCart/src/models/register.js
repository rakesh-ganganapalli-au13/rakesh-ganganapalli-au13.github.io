const mongoose = require("mongoose");


const registerSchema = mongoose.Schema({
    name     : {
                 type:String,
                 require : true
                },
    email    : {type:String,require:true},
    phone    : {type:Number},
    password : {type:String, require:true, min:6},
    createdDate : {
        type    : Date,
        default : Date.now
    },
    

});


module.exports = mongoose.model('register', registerSchema)
const mongoose = require("mongoose")


const pageSchema = mongoose.Schema({

    title   : {type : String, required:true},
    slug    : {type : String},
    contant : {type : String, required:true}

});


module.exports = mongoose.model('pages',pageSchema)


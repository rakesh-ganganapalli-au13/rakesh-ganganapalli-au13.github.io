const mongoose = require('mongoose')
const path       = require('path');
require('dotenv').config({path : path.join(__dirname,'../../.env')});


const InitMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true,useUnifiedTopology: true});
        console.log('Connected to mongodb!!')

    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitMongo;
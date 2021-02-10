const mongoose = require("mongoose")


mongoose.connect('mongodb://localhost:27017/rakesh',{useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log("database connected sucsussfully")})
.catch(()=>console.log("database not connected"))
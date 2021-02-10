const express = require("express")
const app     = express()
const path = require("path")

//creating a server at port 2000
app.listen(2000,()=>{
    console.log("server running at 2000")
})


//link static files l(ike css and images)
app.use(express.static(path.join(__dirname+'/public')));


//route
app.get('/',(req,res)=>{
    
    //path for html file
    const filepath = path.join(__dirname,'public/port.html')
    res.sendFile(filepath)
})
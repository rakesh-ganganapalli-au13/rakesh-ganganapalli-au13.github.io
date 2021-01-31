const express = require("express")
const app     = express()
const path = require("path")


app.listen(2000,()=>{
    console.log("server running at 2000")
})


app.get('/',(req,res)=>{
    res.end("hello")
})


app.get('/home',(req,res)=>{

    const filepath = path.join(__dirname,'static/home.html')
    res.sendFile(filepath)
})
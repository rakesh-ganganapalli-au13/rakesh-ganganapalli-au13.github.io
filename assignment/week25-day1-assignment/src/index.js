require("babel-polyfill")
require("./db/mangoose")
const express = require("express")
const Blog = require("./models/model")



const app =express()

app.use(express.json())





app.post('/',async(req,res)=>{

    const data = new Blog(req.body)

    await data.save()

    console.log(data)

    res.send("User SignUp completed sucessfully")
    
})



app.listen(2000,()=>{
    console.log("server running 2000")
})

const path = require("path")
const hbs = require("hbs")
const express = require("express")
const app = express()


app.listen(2000)

app.set("view engine",'hbs')
app.set("views",path.join(__dirname,'views'))
app.use(express.static(__dirname + '/views'))


app.get('/',(req,res)=>{
    res.render('home.hbs')
})
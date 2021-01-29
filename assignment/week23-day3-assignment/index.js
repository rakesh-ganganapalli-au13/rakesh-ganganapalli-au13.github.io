//importing the all the required modules
const hbs = require('hbs')
const path = require('path')
const bodyparser = require('body-parser')     
const express = require("express")


//array for the storing the users
let users =[]

const app = express()

//creating the server at port 2000
app.listen(2000)

//setting the view engine
app.set('view engine', 'hbs')
app.set('views',path.join(__dirname,'views'))

//used to link css file to home.hbs
app.use(express.static(__dirname + '/views')); 

//using body-parser middlewere to get request body
app.use(bodyparser.urlencoded({extended:false})) 
app.use(bodyparser.json())

//initial route
app.get('/',(req,res)=>{
    res.end('<h1>hello user if you need sign in use /signup route <h1>')
})

//signup route
app.get('/signup',(req,res)=>{
    
    const data ={

        title : "signup page",
        users,
        name : '',
        email : '',
        phone : '',
        adders : '',
        hobbies : ''

    }
    res.render("form.hbs",data)
})


//signup route for post method to get data from the client
app.post('/signup',(req,res)=>{
    
    console.log(req.body) 
    
    const data ={

        title : "signup page",
        users,
        
    }
    res.render("form.hbs",data)

    if(!req.body.name) {
        error.name = 'Please enter the name';
        res.render('signup',{...data,error});
        return;
    }
   
    users.push(req.body)
    res.redirect('/users')
    

})


//route for the getting users
app.get('/users',(req,res)=>{
    let data = {
        title : "users page",
        users
    }
    return res.render('users.hbs',data)
    
})




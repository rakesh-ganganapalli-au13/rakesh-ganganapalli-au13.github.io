const express          = require("express");
const path             = require('path');
require("dotenv").config({path : path.join(__dirname,'../.env')});
const app = express();
const expressValidator  = require('express-validator');
const DBconnection      =  require("./config/db");
const session           = require("express-session");
const cors              = require('cors')

const port              =  process.env.PORT || 4000



//database connection
DBconnection();


//bodyparser/express-parser setup
app.use(express.json());
app.use(express.urlencoded({extended:true}));




//express validator middlewere
app.use(expressValidator());


//static file setup
app.use(express.static(path.join(__dirname, "public")));


//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');



//express-validator setup for checking image file
app.use(expressValidator({
    customValidators: {
        isImage: function(value, filename) {
    
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case  '.png':
                    return '.png';
                default:
                    return false;
            }
        }
    }}));



//express-sessions Middle were 
app.use(session({
    secret:"keyboard cat",
    resave : false,
    saveUninitialized : true,
    cookie :{secure:false}
}));

//cors middlewere 
app.use(cors())



//set up for cart 
app.get('*',(req,res,next)=>{
    // console.log(req.session.cart)
    res.locals.cart = req.session.cart
    next()
})

app.get('*',(req,res,next)=>{
    let token = "rakesh"
    res.header('auth-token',token)
    next()
})

//get page model for display pages in userend
const pages = require('./models/adminPages')

//set all pages in header on userend
const page = async()=>{ await pages.find({},(err,page)=>{
    if(err) return console.log(err);

    app.locals.pages = page;
})}
//calling page function
page()


//get category model for shows categories on userend
const categories = require('./models/adminCategories')

//set all categories in header on userend
const category = async()=>{await categories.find({},(err,cat)=>{
    if(err) return console.log(err);

    app.locals.categories = cat;

})}
//calling category function
category()





//importing the admin side routes
const  adminPages      = require('./routes/Admin/adminPages');
const  adminCategories = require('./routes/Admin/adminCategories');
const  adminProducts   = require('./routes/Admin/adminProducts');
//importing user side routes
const  userHome        = require('./routes/User/pages');
const  userProducts    = require('./routes/User/products');
const  userCart        = require('./routes/User/cart');

const  userSignUp      = require('./routes/userSignUp_Login/signUp_Login')

//routes middleweres
app.use('/api/admin/pages',adminPages);
app.use('/api/admin/categories',adminCategories);
app.use('/api/admin/products',adminProducts);
app.use('/',userHome);
app.use('/api/user',userProducts);
app.use('/api/cart',userCart)
app.use('/api/user',userSignUp)





//port setup
app.listen(port,()=>{
    console.log(`server starting at ${port}`);
});




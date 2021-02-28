const express    = require("express");
const path             = require('path');
const ejs              = require("ejs");
const InitMongo        = require("./config/db");
require("dotenv").config({path : path.join(__dirname,'.env')});
require('./config/db');
const parser           = require('body-parser');
const session          = require("express-session");
const messege          = require("express-messages");
const fileUpload       = require('express-fileupload')
const fs               = require('fs-extra')
const resizeImg        = require('resize-img');
const expressValidator = require('express-validator')
const app = express();


//DataBase connection
InitMongo();



//view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');



//set public folder (for static files like css and images etc)
app.use(express.static(__dirname, + './public'));



//get page model for display pages in frontend
const pages = require('./models/pages')

//set all pages in header on frontend
pages.find({},(err,page)=>{
    if(err) return console.log(err);

    app.locals.pages = page;
})


//get category model for shows categories on frontend
const categories = require('./models/category')

//set all categories in header on frontend
categories.find({},(err,cat)=>{
    if(err) return console.log(err);

    app.locals.categories = cat;
})

















//body parser setup middlewere
app.use(parser.json());
app.use(parser.urlencoded({extended:true}));






//express-validator middlewere
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






//express-messeges middilewere setup
// app.use(require('connect-flash')());
// app.use(function (req, res, next) {
//   res.locals.messages = messege(req, res);
//   next();
// });

app.get('*',(req,res,next)=>{
    res.locals.cart = req.session.cart
    next()
})





//express-fileUpload middilewere
app.use(fileUpload())









const adminPage        = require('./routes/admin_page');
const adminCategory    = require('./routes/admin_categories');
const products         = require('./routes/admin_products');

//for display all products and pages and categories in user end
const userPage           = require('./routes/pages');
const userproducts        = require('./routes/userProduct');
const cart         = require('./routes/cart');


//routes middlewere
app.use('/api/admin/pages',adminPage)
app.use('/api/admin/categories',adminCategory)
app.use('/api/admin/products',products)

app.use('/api',userPage);
app.use('/api/products',userproducts)
app.use('/api/cart',cart);








//port setup
app.listen(process.env.PORT,console.log(`server starting at ${process.env.PORT}`));




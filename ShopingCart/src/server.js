const express    = require("express");
const path             = require('path');
const ejs              = require("ejs");
const InitMongo        = require("./config/db");
require("dotenv").config({path : path.join(__dirname,'.env')});
require('./config/db');
const routes           = require('./routes/router');
const adminPage        = require('./routes/admin_page');
const adminCategory    = require('./routes/admin_categories');
const products         = require('./routes/admin_products');
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
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = messege(req, res);
  next();
});





//fileUpload middilewere
app.use(fileUpload())





//routes middlewere
app.use('/api',routes);
app.use('/api/admin/pages',adminPage)
app.use('/api/admin/categories',adminCategory)
app.use('/api/admin/products',products)








//port setup
app.listen(process.env.PORT,console.log(`server starting at ${process.env.PORT}`));




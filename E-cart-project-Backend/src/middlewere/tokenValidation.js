const jwt   = require("jsonwebtoken");
const path  = require('path');
require('dotenv').config({path : path.join(__dirname,'../../.env')});


const auth = function (req, res, next) {

    const token = req.header("auth-token")

    // console.log(token)

    if (!token) return res.status(401).send("Access Denied")

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY) ; //varified have the id value of user becoz in genarating token we are encoded (or)genarated token based on id of user and some secreat key
        
        req.user = verified  //creating a user property in request object and assign a varified value

        // console.log(req.user)
        next()

    } catch (e) {
        res.status(402).send("Invalid token");

    }


}

module.exports = auth;

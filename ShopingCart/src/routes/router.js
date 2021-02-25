const router = require('express').Router();


router.get("/user",(req,res)=>{
    let data = {
        title : "rakesh",
        name  : req.body.name,
        email : req.body.email
    }
    res.render('index')
});


router.get('/user/login',(req,res)=>{

})







module.exports = router;
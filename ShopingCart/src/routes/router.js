const router = require('express').Router();
const pages = require('../models/pages')


/* Get api/user*/

router.get("/user",(req,res)=>{
    let data = {
        title : "Home page",
        contant : "home page"
    }
    res.render('index',data)
});


/* Get api/page and display page conant*/

router.get("/:slug",(req,res)=>{
    // console.log(req.params.slug)
    let slug = req.params.slug;
    pages.find({slug:slug},(err,page)=>{
        if(err) return console.log(err)

        if(!page.length){ 
            // console.log("redirected")
            return res.redirect('/api/user') 
        }else{
            let data = {
                title : page[0].title,
                contant : page[0].contant
            }
            res.render('index',data)

        }

    })

});







module.exports = router;
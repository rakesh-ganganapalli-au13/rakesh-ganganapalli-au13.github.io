const router = require('express').Router();
const pages = require('../models/pages')


/* Get api/user*/

router.get("/user",(req,res)=>{
    let data = {
        title : "Home",
        contant : "hello users!!welcome to our website,we have great deales for you!!Happy shoping."
    }
    res.render('index',data)
});


/* Get api/page and display page conant*/

router.get("/:slug",async(req,res)=>{
    // console.log(req.params.slug)
    let slug = req.params.slug;
    await pages.find({slug:slug},(err,page)=>{
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
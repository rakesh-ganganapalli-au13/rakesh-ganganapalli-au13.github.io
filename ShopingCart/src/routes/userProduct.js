const router = require('express').Router();
const product = require('../models/products')
const category = require('../models/category')


/* Get api/products
get all products*/

router.get("/view",(req,res)=>{

    product.find({},(err,pro)=>{
        if(err) return console.log(err);

        let data = {
            title : "All products",
            products : pro
        }
        res.render('allProducts',data)
    })
    
});


/* Get api/products/category
get all products based on category*/

router.get("/:category",(req,res)=>{

    let categoryslug = req.params.category

    category.findOne({slug : categoryslug},(err,cat)=>{

        product.find({category:categoryslug},(err,pro)=>{
            if(err) return console.log(err);
    
            let data = {
                title : cat.title,
                products : pro
            }
            res.render('catProducts',data)
        })

    })

    
    
});






module.exports = router;
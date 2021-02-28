const router = require('express').Router();
const product = require('../models/products')
const category = require('../models/category')
const fs       = require('fs-extra')


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





/*Method : GET
get the detailes of products
api/produts/category/product */

router.get("/:category/:product",(req,res)=>{

    let galleryimage = null;

    

    product.findOne({slug : req.params.product},(err,pro)=>{

            if(err) return console.log(err);

            

            let gallerydir = 'src/public/product_images/'+pro._id+'/gallery';

            fs.readdir(gallerydir,(err,files)=>{
                if(err) return console.log(err);

                

                galleryimage = files

                let data = {
                    title : pro.title,
                    product : pro,
                    images : galleryimage
                }
                // console.log(data.product)
                res.render('Products',data)
    

            })
    
            
    })

    
    
});






module.exports = router;
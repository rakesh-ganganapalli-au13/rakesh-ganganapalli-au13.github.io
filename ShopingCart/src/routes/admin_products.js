const router            = require("express").Router();
const fs                = require('fs-extra')
const mkdirp            = require('mkdirp')
const resizeImg         = require('resize-img')
require('express-validator')
const path = require('path')

// const {} = require('express-fileupload')

//products model
const products = require('../models/products')
//category model
const categories = require('../models/category');





/* All products
Method : get*/
router.get('/',async (req,res)=>{
    var count = 0 ; 
    

    await products.countDocuments((err,c)=>{
        if(err) return console.log(err)
        count = c;
    })

    await products.find((err,product)=>{
        let data ={
            products : product,
            count    : count,
            error    : ''
        }
    
        res.render('admin/products',data)
    })
   

})



/* Add product
Method : get*/
router.get('/add-product',(req,res)=>{

    categories.find((err,categories)=>{
        let data = {
            title : '',
            category : categories,
            price : '',
            discription : '',
            error  : ''
        }
        res.render('admin/add-product',data)

    })


   
})




/* Add product
Method : post*/
router.post('/add-product',(req,res)=>{

    //checking image file is undefined or not
    if(!req.files){ imgFile =""; }

    if(req.files){
        var imgFile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";}


    req.checkBody('title','please enter title').notEmpty()
    req.checkBody('price','please enter the price').isDecimal()
    req.checkBody('discription','please enter discription').notEmpty()
    req.checkBody('category','please enter the category').notEmpty()
    req.checkBody('image','please upload image').isImage(imgFile)


        // console.log(req.body)

        let title       = req.body.title;
        let slug        = title.replace(/\s+/g,'-').toLowerCase();
        let discription = req.body.discription
        let price       = req.body.price
        let category    = req.body.category

    const errors = req.validationErrors()

    console.log(errors)
    
    if(errors.length){

        categories.find((err,categories)=>{
            let data = {
                title       : title,
                category    : categories,
                price       : price,
                discription : discription,
                error       : errors
            }
            res.render('admin/add-product',data)
    
        })
    }else{

        products.findOne({slug : slug},(err,product)=>{

            if(product){
            //req.flash('danger','page already exists')
                categories.find((err,categories)=>{
                    const data = {

                        title        : title,
                        price        : price,
                        discription  : discription,
                        category     : categories,
                        error        : [{msg:'product title already exist'}]
                    }
                    return res.render('admin/add-product',data)
                })
            
            }else{

                let price2 =parseFloat(price).toFixed(2)
                const product = new products({
                    title         : title,
                    slug          : slug,
                    price         : price2,
                    discription   : discription,
                    category      : category,
                    image         : imgFile
                })
                product.save((err)=>{
                    if(err) return console.log(err)
                    // req.flash('sucess','page added sucessfully')

            

                mkdirp.sync('src/public/product_images/' + product._id)
                
                mkdirp.sync('src/public/product_images/' + product._id + '/gallery')

                mkdirp.sync('src/public/product_images/' + product._id + '/gallery' + '/thumbnail')

                if(imgFile != ''){
                    let productImage = req.files.image
                    let path = 'src/public/product_images/' + product._id +'/' + imgFile;

                    productImage.mv(path,(err)=>{
                        if(err) return console.log(err)
                    })
                }



                res.redirect('/api/admin/products')
            }) 
        }
    })




    }

})





/* Edit page
Method : get*/
router.get('/edit-product/:id',(req,res)=>{

    let error;
    if(req.session.errors) error=req.session.errors;
    req.session.errors = null;


    categories.find((err,categories)=>{

        products.findById(req.params.id,(err,p)=>{
            if(err){ 
                console.log(err)
                return res.redirect('/api/admin/products')
            }else{
                var galleryDir = 'src/public/product_images/'+p._id+'/gallery';
                var galleryImages = null;
                fs.readdir(galleryDir,(err,files)=>{
                    if(err) return console.log(err);

                    galleryImages = files;


                    let data = {
                        title         : p.title,
                        category      : categories,
                        category2     : p.category.replace(/\s+/g,'-').toLowerCase(),//for checking category is == pevious category or not if page edit(it used in edit.ejs)
                        price         : parseFloat(p.price).toFixed(2),
                        discription   : p.discription,
                        image         : p.image,
                        galleryImages : galleryImages,
                        error         : '',
                        id            : p._id
                    }
                    res.render('admin/edit-product',data)
                })
            }
        })
    })
})

       




/* Edit(update) product
Method : post*/

router.post('/edit-product/:id',(req,res)=>{

    

     //checking image file is undefined or not
     if(!req.files){ imgFile =""; }

     if(req.files){
         var imgFile = typeof(req.files.image) !== "undefined" ? req.files.image.name : "";}

         
  
     req.checkBody('title','please enter title').notEmpty()
     req.checkBody('price','please enter the price').isDecimal()
     req.checkBody('discription','please enter discription').notEmpty()
     req.checkBody('category','please enter the category').notEmpty()
     req.checkBody('image','please upload image').isImage(imgFile)
 
 
        
 
         let title       = req.body.title;
         let slug        = title.replace(/\s+/g,'-').toLowerCase();
         let discription = req.body.discription
         let price       = req.body.price
         let category    = req.body.category
         let pimage      = req.body.pimage
         let id          = req.params.id
 
     const errors = req.validationErrors()
     console.log(pimage)
    if(errors) {
        
        req.session.errors = errors;
        return res.redirect('/api/admin/products/edit-product/'+id)
        

    }else{
        products.findOne({slug:slug,_id : {'$ne' : id}},(err,p)=>{

            if(err) return console.log(err);

            if(p){
                // console.log('product title exist')
                res.redirect('/api/admin/products/edit-product/'+id)
            }else{
                products.findById(id,(err,p)=>{

                    if(err) return console.log(err)

                    p.title       = title
                    p.slug        = slug
                    p.discription = discription
                    p.price       = parseFloat(price).toFixed(2)
                    p.category    = category

                    if(imgFile != ''){
                        p.image   = imgFile;
                    }

                    console.log('289',imgFile)
                    // console.log(pimage)

                    p.save((err)=>{
                        if(err) return console.log(err)

                        if(imgFile != ''){
                            if(pimage != ''){
                                fs.remove('src/public/product_images/'+id+'/'+pimage, (err)=>{
                                    if(err) return console.log(err)
                                })
                            }
                                    
                            let productImage = req.files.image
                            let path = 'src/public/product_images/' + id +'/' + imgFile;
        
                            productImage.mv(path,(err)=>{
                                if(err) return console.log(err)
                            })
                                
                            }
                        res.redirect('/api/admin/products')
                    })

                })
            }
        })
    }

 





})





/* delete page
Method : post*/
// router.get('/delete-page/:id',async(req,res)=>{

//     await pages.findByIdAndDelete({_id : req.params.id}, (err)=>{

//         if(err){
//             console.log(err)
//         }

//         res.redirect( '/api/admin/pages')

//     })

    
// })













module.exports = router;


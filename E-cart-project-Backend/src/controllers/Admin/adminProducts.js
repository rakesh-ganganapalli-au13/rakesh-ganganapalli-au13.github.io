const products   = require('../../models/adminProducts');
const categories = require('../../models/adminCategories');
const cloudinary = require('../../config/cloudinary');


const adminProducts = {

    async getAllProducts(req,res){
        var count = 0 ; 
        await products.countDocuments((err,c)=>{
            if(err) return console.log(err)
            count = c;
        })
    
        await products.find((err,product)=>{
            if (err) return console.log(err);
            // console.log(product)
            let data ={
                products : product,
                count    : count,
                error    : ''
            };
          
        
            res.render('admin/products/products',data);
        })
    },


    async getAddProduct(req,res){

        // console.log(result.secure_url)
    
        categories.find({},(err,categories)=>{
    
            if(err) return console.log(err)
    
            let data = {
                title : '',
                category : categories,
                price : '',
                discription : '',
                image : '',
                img_url : '',
                error  : ''
            }
    
        res.render('admin/products/add-product',data)
        })
    
    
    },


    async postAddProduct(req,res){

        //   checking image file is undefined or not
        // console.log(req.file)
        if(!req.file){ imgFile =""; }
    
        if(req.file){
            
            var imgFile = typeof(req.file) !== "undefined" ? req.file.originalname : "";
        }
    
    
    
        req.checkBody('title',       'please enter title').notEmpty()
        req.checkBody('price',       'please enter the price').isDecimal()
        req.checkBody('discription', 'please enter discription').notEmpty()
        req.checkBody('category',    'please enter the category').notEmpty()
        if(req.file)
            req.checkBody('image',        'please upload valid image file').isImage(imgFile)
    
        let errors = req.validationErrors();
       
    
    
        let title       = req.body.title;
        let slug        = title.replace(/\s+/g,'-').toLowerCase();
        let discription = req.body.discription;
        let price       = req.body.price;
        let category    = req.body.category;
    
    
    
        if(errors.length){
    
            await categories.find(async(err,categories)=>{
    
                if(err) return console.log(err);
    
                let data = {
                    title       : title,
                    category    : categories,
                    price       : price,
                    discription : discription,
                    error       : errors
                }
                
                res.render('admin/products/add-product',data)
        
            })
        }else{
    
            await products.findOne({slug : slug},async(err,product)=>{
    
                if(err) return console.log(err);
    
                if(product){
                   await categories.find((err,categories)=>{
    
                        if(err) return console.log(err);
    
                        const data = {
    
                            title        : title,
                            price        : price,
                            discription  : discription,
                            category     : categories,
                            error        : [{msg:'product title already exist'}]
                        }
                        return res.render('admin/products/add-product',data);
                    })
                
                }else{
    
                  
                    
    
            
                    let price2 = parseFloat(price).toFixed(2);
    
                    const product = new products({
                    
                        title         : title,
                        slug          : slug,
                        price         : price2,
                        discription   : discription,
                        category      : category,
                        image         : imgFile,
                        img_url       : '',
                    })
    
                    // console.log(product)
                    if(req.file){
    
                        var result = await cloudinary.uploader.upload(req.file.path, {folder:"product_images/" + product._id });
    
                        // console.log(177,result.secure_url);
    
                        product.img_url = result.secure_url;
                        product.cloudinary_id = result.public_id;
                    };
                    
                    
    
                        // console.log(product)
                    
    
                    product.save(async(err)=>{
    
                        if(err) return console.log(err);
    
                         res.redirect('/api/admin/products')
    
                    })
                }
        
      
            })
        }
    
    
    },


    async getEditProduct(req,res){

        let error;
        if(req.session.errors) error = req.session.errors;
        req.session.errors = null;
        // console.log(191,req.session.errors)
    
    
    
        await categories.find(async(err,categories)=>{
    
            if(err) return console.log(err);
    
            await products.findById(req.params.id,(err,p)=>{
    
                if(err){ 
                    
                    console.log(err);
                    return res.redirect('/api/admin/products');
    
                }else{
                        // console.log(223,categories)
                        let data = {
                            title         : p.title,
                            category      : categories,
                            category2     : p.category.replace(/\s+/g,'-').toLowerCase(),//for checking category is == pevious category or not if page edit(it used in edit.ejs)
                            price         : parseFloat(p.price).toFixed(2),
                            discription   : p.discription,
                            image         : p.image,
                            img_url       : p.img_url,
                            error         : '',
                            id            : p._id
                        }
                        res.render('admin/products/edit-product',data)
                    
                }
            })
        })
    },


    async postEditProduct(req,res){


        //checking image file is undefined or not
        // console.log(req.file,req.body)
        if(!req.file){ imgFile =""; }
    
        if(req.file){
            
            var imgFile = typeof(req.file) !== "undefined" ? req.file.originalname : "";
        }
    
            
     
        req.checkBody('title',      'please enter title').notEmpty()
        req.checkBody('price',      'please enter the price').isDecimal()
        req.checkBody('discription','please enter discription').notEmpty()
        req.checkBody('category',   'please enter the category').notEmpty()
        if(req.file)
            req.checkBody('image',  'please upload valid image file').isImage(imgFile)
    
        
            let title       = req.body.title;
            let slug        = title.replace(/\s+/g,'-').toLowerCase();
            let price       = req.body.price 
            let discription = req.body.discription
            let category    = req.body.category
            let id          = req.params.id
    
        
        const errors = req.validationErrors();
    
    
       if(errors.length) {
           
           req.session.errors = errors ;
           return res.redirect('/api/admin/products/edit-product/'+id)
           
    
       }else{
           await products.findOne({slug:slug,_id : {'$ne' : id}},async(err,p)=>{
    
               if(err) return console.log(err);
    
               if(p){
                   console.log('product title exist')
                   res.redirect('/api/admin/products/edit-product/'+id)
               }else{
                 await products.findById(id,async(err,p)=>{
    
                       if(err) return console.log(err);
    
                       p.title       = title
                       p.slug        = slug
                       p.discription = discription
                       p.price       = parseFloat(price).toFixed(2)
                       p.category    = category
                       p.image       = imgFile
    
                    await cloudinary.uploader.destroy(p.cloudinary_id);
                    if(req.file){
                       let result = await cloudinary.uploader.upload(req.file.path, {folder:"product_images/" + p._id });
                       p.img_url   = result.secure_url;
                       p.cloudinary_id = result.public_id
                    }
                      
                    //    console.log(p)
    
                       await p.save((err)=>{
                           if(err) return console.log(err)    
                           res.redirect('/api/admin/products')
                       })
    
                   })
               }
           })
       }
    
    },


    async getDeleteProduct(req,res){

        let id = req.params.id;
    
        let result = await products.findById(id);
    
        // console.log(result)
        if(result.img_url !== ''){
            await cloudinary.uploader.destroy(result.cloudinary_id);
        }
    
        result.remove()
    
        res.redirect('/api/admin/products')
        
    
    }

}





module.exports = adminProducts;
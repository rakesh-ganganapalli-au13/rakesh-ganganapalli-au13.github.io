const categories = require('../../models/adminCategories');

const products   = require('../../models/adminProducts');

const cloudinary = require('../../config/cloudinary');


const adminCategories  =  {

    async getAllCategories(req,res){

        let Allcategories = await categories.find({});
        const data = {
            Allcategories : Allcategories,
            error         : ''
        }
        res.render('admin/categories/categories',data)
    },


    getAddCategory(req,res){

        const data = {
            title : '',
            slug  : '',
            error : ''
        }
        res.render('admin/categories/add-category',data)
    },


    async postAddCategory(req,res){

        req.checkBody('title','please enter title').notEmpty()
        
    
        let title    = req.body.title;
    
        let slug     = req.body.slug.replace(/\s+/g,'-').toLowerCase();
        if(slug=='') slug = title.replace(/\s+/g,'-').toLowerCase();
        // console.log(slug)
    
    
        const errors = req.validationErrors()
        // console.log(errors)
    
    if(errors.length){
    
        const data = {
    
            title    : title,
            slug     : slug,
            error    : errors
        }
        // console.log(data.error)
        return res.render('admin/categories/add-category',data)
    }else{
    
    await categories.findOne({slug : slug},(err,category)=>{
    
        if(category){
            // req.flash('danger','page already exists')
            const data = {
    
                title    : title,
                slug     : slug,
                error    : [{msg:'category already exist'}]
            }
            return res.render('admin/categories/add-category',data)
            
        }else{
            const category = new categories({
                title    : title,
                slug     : slug
            })
            category.save(async(err)=>{
    
                if(err) return console.log(err);
    
                //for update the categories on user end
                await categories.find({},(err,cat)=>{
                    if(err) return console.log(err);
                    req.app.locals.categories = cat;
                    });
    
                res.redirect('/api/admin/categories');
            })
        }
    });
    
    }
    
    },


    async getEditCategory(req,res){
        //   console.log(req.url)
    
        await categories.find({slug:req.params.slug},(err,cat)=>{
            // console.log(cat[0].title)
            if(err) return console.log(err)
            const data = {
                id    : cat[0]._id,
                title : cat[0].title,
                slug  : cat[0].slug,
                error : ''
            }
            res.render('admin/categories/edit-category',data)
    
    
        })
       
    },


    async postEditCategory(req,res){

        req.checkBody('title','plese enter category name');

        let title = req.body.title;
        let slug  = req.body.slug.replace(/\s+/g,'-').toLowerCase();
        if (slug=='') slug = title.replace(/\s+/g,'-').toLowerCase();
        let id     = req.body.id

        // console.log(125)

        let errors = req.validationErrors();

        if(errors.length){
            let data = {
                title : title,
                slug  : slug,
                error : errors
            }
            res.render('admin/categories/edit-category',data)
        }else{

           await categories.findOne({slug:slug, _id : {$ne : id}},async(err,cat)=>{

                if(err) return console.log(err)

                if(cat){
                    const data = {
                        id       : id,
                        title    : title,
                        slug     : slug,
                        error    : [{msg:'category already exist'}]
                    }
        
                    return res.render('admin/categories/edit-category',data)
                    
                }else{


                    await categories.findById(id,(err,category)=>{

                        if(err) return console.log(err)
        
                        category.title    = title
                        category.slug     = slug
                
                        category.save(async(err)=>{
                        if(err) return console.log(err)

                         //for update the categories on user end
                        await categories.find({},(err,cat)=>{
                            if(err) return console.log(err);
                            req.app.locals.categories = cat;
                            });

                        res.redirect('/api/admin/categories')
                        })
                    })
                 }
            })

        } 

    },


    async getDeleteCategory(req,res){

        categories.findByIdAndDelete({_id : req.params.id},async(e,r)=>{
                 products.find({category:r.slug},async(err,p)=>{
     
                     for (i=0;i<p.length;i++){
                         await cloudinary.uploader.destroy(p[i].cloudinary_id);
                     }
                 })
     
                 products.deleteMany({category:r.slug},async(err,p)=>{
                 })
     
             //for update the categories on user end
              await categories.find({},(err,cat)=>{
                 if(err) return console.log(err);
                 req.app.locals.categories = cat;
                 });
             
             res.redirect('/api/admin/categories/')
     
     
         });          
        
     }


}










module.exports = adminCategories;
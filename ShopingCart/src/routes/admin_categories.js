const { checkBody, validationResult } = require("express-validator");

const router = require("express").Router();

//category model
const category = require('../models/category')



/* All category
Method : get*/
router.get('/',async(req,res)=>{

    let categories = await category.find({})

    res.render( 'admin/categories',{categories :categories,error:''})
})





/* Add category
Method : get*/

router.get('/add-category',(req,res)=>{
    category.find((err,category)=>{

        if(err) return console.log(err)

    let data = {
       title : '',
       slug  : '',
       error : ''
    }
    res.render('admin/add-category',data)
})

})






/* Add category
Method : post*/
router.post('/Add-category',(req,res)=>{

        req.checkBody('title','please enter title').notEmpty()

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
        if(slug=='') slug = title.replace(/\s+/g,'-').toLowerCase();
    

        const errors = req.validationErrors()
    // console.log(errors)

    if(errors.length){

        const data = {

            title    : title,
            slug     : slug,
            error    : errors
        }
        // console.log(data.error)
        return res.render('admin/add-category',data)
    }else{

    category.findOne({slug : slug},(err,page)=>{

        if(page){
            req.flash('danger','category already exists')
            const data = {

                title    : title,
                slug     : slug,
                error    : [{msg:'category already exist'}]
            }
            return res.render('admin/add-category',data)
            
        }else{
            const cat = new category({
                title    : title,
                slug     : slug
            })
            cat.save((err)=>{
                if(err) return console.log(err)


                //for fentend auto update pages when reload without server
                category.find({},(err,cat)=>{
                    if(err) return console.log(err);
                
                    req.app.locals.categories = cat;
                })



                // req.flash('sucess','page added sucessfully')
                res.redirect('/api/admin/categories')
            })
        }
    })




    }

})






/* Edit category
Method : get*/
router.get('/edit-category/:slug',(req,res)=>{

    category.findOne({slug:req.params.slug},(err,page)=>{
        if(err) return consolog(err);

        let data = {
            id      : page._id,
            title   : page.title,
            slug    : page.slug,
            error   : ''
        }
        res.render('admin/edit-category',data)
    })

})





// /* Edit(update) category
// Method : post*/

router.post('/edit-category/:slug',(req,res)=>{


        req.checkBody('title','please enter title').notEmpty() 
        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
        if(slug=='') slug = title.replace(/\s+/g,'-').toLowerCase();
        let id      = req.body.id

        const errors = req.validationErrors()
    // console.log(errors)

    if(errors.length){

        const data = {
            id       : id,
            title    : title,
            slug     : slug,
            error    : errors
        }
        // console.log(data.error)
        return res.render('admin/edit-category',data)
    }else{

    category.findOne({slug : slug, _id :{$ne : id}},(err,page)=>{

        if(page){
            req.flash('danger','page already exists')
            const data = {
                id       : id,
                title    : title,
                slug     : slug,
                error    : [{msg:'category already exist'}]
            }

            return res.render('admin/edit-category',data)
            
        }else{

            category.findById(id,(err,cate)=>{

                if(err) return console.log(err);

                cate.title    = title;
                cate.slug     = slug;
           
                cate.save((err)=>{
                if(err) return console.log(err);
                
                 //for frontend auto update pages without server restarting,if you cant use this then you can restart server when you made changes in backend to reflect in frontend
                category.find({},(err,cat)=>{
                if(err) return console.log(err);
                req.app.locals.categories = cat;
                });

                // req.flash('sucess','page updated sucessfully')
                res.redirect('/api/admin/categories');
            })

        })
    }




    })

}

})







/* delete category
Method : get*/
router.get('/delete-category/:id',async(req,res)=>{

    await category.findByIdAndDelete({_id : req.params.id}, (err)=>{

        if(err){
            console.log(err)
        }

        //for frontend auto update pages without server restarting,if you cant use this then you can restart server when you made changes in backend to reflect in frontend
         category.find({},(err,cat)=>{
            if(err) return console.log(err);
            req.app.locals.categories = cat;
        })

        res.redirect( '/api/admin/categories')

    })

    
})









module.exports = router;

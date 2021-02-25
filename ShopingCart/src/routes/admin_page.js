const { Router } = require("express");
const { checkBody, validationResult } = require("express-validator");

const router = require("express").Router();

const pages = require('../models/pages')



/* All pages
Method : get*/
router.get('/',async(req,res)=>{

    let Allpages = await pages.find({})

    res.render( 'admin/Allpages',{Allpages : Allpages,error:''})
})





/* Add page
Method : get*/
router.get('/add-page',(req,res)=>{
    let data = {
        title : '',
        slug : '',
        contant : '',
        error  : ''
    }
    res.render('admin/add-page',data)
})





/* Add page
Method : post*/
router.post('/add-page',(req,res)=>{

        req.checkBody('title','please enter title').notEmpty()
        req.checkBody('contant','please enter contant').notEmpty()

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
        if(slug=='') slug = title.replace(/\s+/g,'-').toLowerCase();
        let contant = req.body.contant

        const errors = req.validationErrors()
    // console.log(errors)

    if(errors.length){

        const data = {

            title    : title,
            slug     : slug,
            contant  : contant,
            error    : errors
        }
        // console.log(data.error)
        return res.render('admin/add-page',data)
    }else{

    pages.findOne({slug : slug},(err,page)=>{

        if(page){
            req.flash('danger','page already exists')
            const data = {

                title    : title,
                slug     : slug,
                contant  : contant,
                error    : [{msg:'page already exist'}]
            }
            return res.render('admin/add-page',data)
            
        }else{
            const page = new pages({
                title    : title,
                slug     : slug,
                contant  : contant
            })
            page.save((err)=>{
                if(err) return console.log(err)
                req.flash('sucess','page added sucessfully')
                res.redirect('/api/admin/pages')
            })
        }
    })




    }

})





/* Edit page
Method : get*/
router.get('/edit-page/:slug',(req,res)=>{

    pages.findOne({slug:req.params.slug},(err,page)=>{
        if(err) return consolog(err);

        let data = {
            id      : page._id,
            title   : page.title,
            slug    : page.slug,
            contant : page.contant,
            error   : ''
        }
        res.render('admin/edit-page',data)
    })

})





/* Edit(update) page
Method : post*/

router.post('/edit-page/:slug',(req,res)=>{

    req.checkBody('title','please enter title').notEmpty(),
    req.checkBody('contant','please enter contant').notEmpty()

        let title = req.body.title;
        let slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
        if(slug=='') slug = title.replace(/\s+/g,'-').toLowerCase();
        let contant = req.body.contant
        let id      = req.body.id

        const errors = req.validationErrors()
    // console.log(errors)

    if(errors.length){

        const data = {
            id       : id,
            title    : title,
            slug     : slug,
            contant  : contant,
            error    : errors
        }
        // console.log(data.error)
        return res.render('admin/edit-page',data)
    }else{

    pages.findOne({slug : slug, _id :{$ne : id}},(err,page)=>{

        if(page){
            req.flash('danger','page already exists')
            const data = {
                id       : id,
                title    : title,
                slug     : slug,
                contant  : contant,
                error    : [{msg:'page already exist'}]
            }

            return res.render('admin/edit-page',data)
            
        }else{

            pages.findById(id,(err,page)=>{

                if(err) return console.log(err)

                page.title    = title
                page.slug     = slug
                page.contant  = contant
           
                page.save((err)=>{
                if(err) return console.log(err)
                req.flash('sucess','page updated sucessfully')
                res.redirect('/api/admin/pages')
            })
        })
    }




    })

}

})





/* delete page
Method : post*/
router.get('/delete-page/:id',async(req,res)=>{

    await pages.findByIdAndDelete({_id : req.params.id}, (err)=>{

        if(err){
            console.log(err)
        }

        res.redirect( '/api/admin/pages')

    })

    
})









module.exports = router;

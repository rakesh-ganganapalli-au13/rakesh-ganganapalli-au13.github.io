const router     = require("express").Router();
const userSignup = require('../models/register');
const bcrypt     = require('bcryptjs')  



router.get('/',(req,res)=>{

    let data = {
        name : '',
        email : '',
        phone : '',
        error : ''
    };
    res.render('signup',data);

});


router.post('/',async(req,res)=>{

    req.checkBody('name','plese enter name').notEmpty();
    req.checkBody('email','plese enter email').notEmpty();
    req.checkBody('phone','plese enter contact number').notEmpty();
    req.checkBody('password','plese enter password').notEmpty();
    req.checkBody('rpassword','plese enter rpassword').notEmpty();
    req.checkBody('checkbox','plese accept terms and conditions').notEmpty();

    let name = req.body.name
    let email = req.body.email
    let phone = req.body.phone





    let errors =  req.validationErrors();

    if(errors.length){
        let data = {
        name : name,
        email : email,
        phone : phone,
        error : errors
        }
        return res.render('signup',data)
    }

    if(req.body.password != req.body.rpassword){
        let data = { 
            name : name,
            email : email,
            phone : phone,
            error : [{msg:"password didn't match"}]
        }
        return res.render('signup',data)
    }

    const hashedPassword = bcrypt.hashSync(req.body.password,8);



    //checking while user exist or not

    await userSignup.find({email:req.body.email},async(err,exist)=>{

        // console.log(exist)
        console.log(68)


        if(exist.length){

            let data = {
                name : name,
                email : email,
                phone : phone,
                error : [{msg:"Email already registred"}]
            }
            return res.render('signup',data)
        }
        else{

            const user = new userSignup ({

                name : req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password:hashedPassword
        
            })
        
            user.save((err)=>{
                if(err) return console.log(err);
                res.redirect('/api/admin/pages')
            })
            
        }
    })   

})








module.exports = router;
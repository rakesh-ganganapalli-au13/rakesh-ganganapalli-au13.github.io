const router = require("express").Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken')
const user   = require('../../models/signUp');
const dotenv = require('dotenv')
const path   = require('path')

dotenv.config({path:path.join(__dirname,'../../../.env')});



/*Method : Get
get signup page*/
router.get('/signup',(req,res)=>{
    let data = {
        name : '',
        email : '',
        phone : '',
        password:'',
        error : ''
        }
    res.render('userSignup_login/signUp',data);
});


/*Method : Post
post signup page*/
router.post('/signup',(req,res)=>{

    // console.log(process.env.SECREAT_KEY)

    req.checkBody('name','please enter name').notEmpty();
    req.checkBody('email','please enter email').notEmpty();
    req.checkBody('password','please enter password').notEmpty();
    req.checkBody('cpassword','please enter conform password').notEmpty();

    // console.log(req.body);

    
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let password = req.body.password;

    let errors = req.validationErrors();

    if(errors.length){
        let data = {
        name : name,
        email : email,
        phone : phone,
        password:password,
        error : errors
        }
        return res.render('userSignup_login/signUp',data);
    };

    if(password != req.body.cpassword){
        let data = { 
            name : name,
            email : email,
            phone : phone,
            password:password,
            error : [{msg:"password didn't match"}]
        }
        return res.render('userSignup_login/signUp',data);
    };

    const hashedPassword = bcrypt.hashSync(password,8);

    //checking user exist ot not if not then save user in db else throw error

    user.findOne({email:email},(err,u)=>{
        if(err) return console.log(err)

        if(u){

            let data = {
                name:name,
                email:email,
                phone:phone,
                password:password,
                error : [{msg:"Email already registered"}]
            }
            return res.render('userSignup_login/signUp',data);

        }else{
            let users = new user({
                name : name,
                email:email,
                phone:phone,
                password:hashedPassword
            })

            users.save((err)=>{
                if(err) return console.log(err)
                res.redirect('/api/user/login')
            })
        }


    })




    
});


/*Method : Get
get login page*/
router.get('/login',(req,res)=>{

    let data = {
        email : '',
        error : ''
        }
    res.render('userSignup_login/login',data);
})


/*Method : Post
post login page*/

router.post('/login',async(req,res)=>{

    req.checkBody('email','please enter email').notEmpty();
    req.checkBody('password','please enter password').notEmpty();

    // console.log(req.body);

    
    let email = req.body.email;
    let password = req.body.password;

    let errors = req.validationErrors();

    if(errors.length){
        let data = {
        email : email,
        error : errors
        }
        return res.render('userSignup_login/login',data);
    };

    let userExist = await  user.find({email:email});

    if(!userExist.length) {
        let data = { 
            email : email,
            error : [{msg:"Email (or) password incorrect"}]
        }
        return res.render('userSignup_login/login',data);

    }

    // console.log(142,userExist);

    let passwordExist = await bcrypt.compare(password,userExist[0].password);

    // console.log(passwordExist)

    if(!passwordExist){

        let data = { 
            email : email,
            error : [{msg:"Email (or) password incorrect"}]
        }
        return res.render('userSignup_login/login',data);
    };

    let token = jwt.sign({_id : userExist[0].id},process.env.SECREAT_KEY)

    // console.log(token)

    res.header('auth-token',token).redirect('/')
    // res.



    
});





module.exports = router;
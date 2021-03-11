const router = require('express').Router();
const pages = require('../models/pages');
const products = require('../models/products');





/* Method : GET
add products to cart*/

router.get("/add/:product",(req,res)=>{
    // console.log(req.params.slug)
    let slug = req.params.product;
    // console.log(slug)

    products.findOne({slug:slug},(err,p)=>{


        if(err) return console.log(err)

        console.log(req.session.cart)
        

        if(typeof req.session.cart == 'undefined'){ 
            req.session.cart =[]
            req.session.cart.push({
                title : slug,
                qty : 1,
                price : parseFloat(p.price).toFixed(2),
                image : '/product_images/'+p.id+'/'+p.image

            })

            // console.log(req.session.cart)
          
        }else{

                let cart = req.session.cart
                let newitem = true

                for(let i=0;i<cart.length;i++){
                    if(cart[i].title==slug){
                        cart[i].qty++
                        newitem = false
                        break;
                    }
                }


                if(newitem){

                    cart.push({
                        title : slug,
                        qty : 1,
                        price : parseFloat(p.price).toFixed(2),
                        image : '/product_images/'+p.id+'/'+p.image
        
                    })

                }


           

        }

        // console.log(req.session.cart)
        res.redirect('back')


    })

});






/* Method : GET
get checkout page*/

router.get("/checkout",(req,res)=>{


    if(req.session.cart && req.session.cart.length == 0){
        delete req.session.cart;

        res.redirect('/api/cart/checkout')
    }else{

            let data = {
                title : 'checkout',
                cart  : req.session.cart

            }

            res.render('checkout',data)

    }
})








/* Method : GET
get update product cart*/

router.get("/update/:product",(req,res)=>{

    let slug = req.params.product
    let cart = req.session.cart
    let action = req.query.action
    // console.log(action)

    for(let i=0; i<cart.length;i++){
        if(cart[i].title == slug){

            switch(action){
                case "add" :
                    cart[i].qty++;
                    break;
                case "remove" :
                    cart[i].qty--;
                    if(cart[i].qty <1 ) cart.splice(i,1);
                    break;
                case "clear" :
                    cart.splice(i,1)
                    if (cart.length == 0) delete req.session.cart;
                    break;
                default:
                    console.log('cart update problem')
                    break;
            }
            break;
        }
    }

    res.redirect('/api/cart/checkout')

})



/* Method : GET
get update product cart*/
router.get("/clear",(req,res)=>{

    delete req.session.cart;

        res.redirect('/api/cart/checkout')

})






module.exports = router;
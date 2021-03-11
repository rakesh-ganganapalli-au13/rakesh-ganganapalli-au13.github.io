const products  = require('../../models/adminProducts')



const cartControllers = { 

    async addProductCart(req,res){

        let slug = req.params.product;
    
        await products.findOne({slug:slug},(e,p)=>{
    
             // console.log(req.session.cart)
            if(typeof req.session.cart == 'undefined'){
                req.session.cart = [],
                req.session.cart.push({
                    title : slug,
                    qty : 1,
                    price : parseFloat(p.price).toFixed(2),
                    image : p.img_url
                })
                
            } else{
    
                let cart = req.session.cart;
                let newitem = true;
    
                    for(let i=0;i<cart.length;i++){
                        if(cart[i].title==slug){
                            cart[i].qty++;
                            newitem = false;
                            break;
                        }
                    }
    
                    if(newitem){
    
                        cart.push({
                            title : slug,
                            qty : 1,
                            price : parseFloat(p.price).toFixed(2),
                            image : p.img_url
            
                        })
    
                    }
            }
            // console.log(req.session.cart)
            res.redirect('back')
    
        })
    
    },



     getCartPage(req,res){
        let data = {
            title : "My cart"
        }
        res.render('user/cart',data)
    },


    getUpdateCartItems(req,res){

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
    
    },


    getClearCart(req,res){

        delete req.session.cart;
    
            res.redirect('/api/cart/checkout')
    
    }
}





module.exports = cartControllers;
const product = require('../../models/adminProducts');


const userProducts={

    async getAllProducts(req,res){
        await product.find({},(err,pro)=>{
            if(err) return console.log(err);
    
            let data = {
                title : "All products",
                name  : 'All products',
                products : pro
            }
            res.render('user/products',data)
        })
        
    },


    async getProduct(req,res){

        let slug = req.params.category;
    
       let result = await product.find({category:slug});
    
       let data = {
           title    : 'products',
           name     :  slug,
           products : result
       };
    
       res.render('user/products',data);
    
    },

    
    async getProductDetails(req,res){

        // console.log(req.header('auth-token'))

        let cat = req.params.category;
        let pro = req.params.product;
    
        let result = await product.find({category:cat,slug:pro});
    
        let data = {
           title    : 'products',
           product  : result[0]
        };
    
       res.render('user/productDetails',data);
    
    }
}

module.exports = userProducts;
const router = require('express').Router();
const userProductsController = require('../../controllers/User/userProductsController');




/*Method : Get 
get all products*/
router.get('/Allproducts',userProductsController.getAllProducts);




/*Method : Get 
product products by category*/
router.get('/:category/products',userProductsController.getProduct)



/*Method : Get 
get product details*/
router.get('/:category/:product',userProductsController.getProductDetails)



module.exports = router;
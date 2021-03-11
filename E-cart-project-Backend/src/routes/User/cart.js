const router = require("express").Router();

const cartController = require('../../controllers/User/cartController');

/*Method : Get,
add product to cart*/
router.get('/add/:product',cartController.addProductCart);




/*Method : Get,
get cart page*/
router.get('/checkout',cartController.getCartPage);




/* Method : GET
get update product cart*/

router.get("/update/:product",cartController.getUpdateCartItems);



/* Method : GET
get update product cart*/
router.get("/clear",cartController.getClearCart);



module.exports  = router;
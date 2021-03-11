const router     = require("express").Router();
const multer     = require("multer");
const adminProductsController = require('../../controllers/Admin/adminProducts');


const upload = multer({
    storage: multer.diskStorage({})
});




/*Method : Get
get all products*/
router.get('/',adminProductsController.getAllProducts);




/*Method : Get
add  products*/
router.get('/add-product',adminProductsController.getAddProduct);




/*Method : post
add  products*/
router.post('/add-product',upload.single('image'),adminProductsController.postAddProduct);


/*Method : Get
edit  products*/
router.get('/edit-product/:id',adminProductsController.getEditProduct);



/*Method : post
edit  products*/
router.post('/edit-product/:id',upload.single('image'),adminProductsController.postEditProduct);



/*Method : Get
delete  products*/
router.get('/delete-product/:id',adminProductsController.getDeleteProduct);





module.exports = router;



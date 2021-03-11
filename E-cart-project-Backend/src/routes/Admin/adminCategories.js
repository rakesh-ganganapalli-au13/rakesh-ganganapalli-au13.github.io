const router     = require("express").Router();

const adminCategoriesController = require('../../controllers/Admin/adminCategories')


/*Method : Get 
  getting all categories*/ 
router.get('/',adminCategoriesController.getAllCategories);


/*Method : Get 
  getting add categories*/ 
router.get('/add-category',adminCategoriesController.getAddCategory);



/*Method : Post
adding a page*/
router.post('/add-category',adminCategoriesController.postAddCategory);




/*Method : Get 
  getting edit categories*/ 
  router.get('/edit-category/:slug',adminCategoriesController.getEditCategory);



/*Method : Get 
  getting edit categories*/ 
  router.post('/edit-category/:slug',adminCategoriesController.postEditCategory);




/*Method : Get 
  delete categories*/ 
router.get('/delete-category/:id',adminCategoriesController.getDeleteCategory);







module.exports = router;
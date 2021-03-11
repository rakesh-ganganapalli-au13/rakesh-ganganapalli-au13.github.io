const router = require('express').Router();

const AdminPagesControllers = require('../../controllers/Admin/adminPages')




/*Method : Get
  Displaying all AdminPages*/
router.get('/',AdminPagesControllers.getAllPages)


/*Method : Get
adding a page */
router.get('/add-page',AdminPagesControllers.getAddPage)



/*Method : Post
adding a page*/
router.post('/add-page',AdminPagesControllers.postAddPage)



/*Method : Get
edit a page*/
router.get('/edit-page/:slug',AdminPagesControllers.getEditPage)



/* Method : Post
Edit(update) page*/
router.post('/edit-page/:slug',AdminPagesControllers.postEditPage)



/* Method : Post
delete page*/
router.get('/delete-page/:id',AdminPagesControllers.getDeletePage)














module.exports = router;
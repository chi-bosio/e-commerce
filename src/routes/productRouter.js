const ProductController = require('../controller/productController')
const {isAdmin} = require('../middlewares/roleAuth')

const Router=require('express').Router;
const router=Router()

router.get('/mockingproducts', ProductController.mockProducts)

router.get('/', ProductController.getAllProducts);
  
router.get('/:pid', ProductController.getProductById);

router.post('/', isAdmin, ProductController.createProduct)

router.put('/:pid', isAdmin, ProductController.updateProduct);

router.delete('/:pid', isAdmin, ProductController.deleteProduct);

module.exports = router
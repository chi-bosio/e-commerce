const ProductController = require('../controller/productController')

const Router=require('express').Router;
const router=Router()

router.get('/mockingproducts', ProductController.mockProducts)

router.get('/loggerTest', ProductController.loggerTest)

router.get('/', ProductController.getAllProducts);
  
router.get('/:pid', ProductController.getProductById);

router.post('/', ProductController.createProduct)

router.put('/:pid', ProductController.updateProduct);

router.delete('/:pid', ProductController.deleteProduct);

module.exports = router
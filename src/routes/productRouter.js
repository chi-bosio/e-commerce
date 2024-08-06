const ProductController = require('../controller/productController')

const Router=require('express').Router;
const router=Router()

router.get('/', ProductController.getAllProducts)
  
router.get('/:pid', ProductController.getProductById)


router.post('/', ProductController.addProduct)


router.put('/:pid', ProductController.updateProduct)


router.delete('/:pid', ProductController.deleteProduct)


module.exports = router
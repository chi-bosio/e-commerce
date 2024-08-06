const CartController = require('../controller/cartController')
const errorHandler = require('../middlewares/errorHandler')
const {purchase} = require('../controller/ticketController')
const Router = require('express').Router;
const router = Router();


router.get('/', CartController.getCarts)

router.get('/:cid', CartController.getCartById)


router.post('/', CartController.createCart)

router.post('/:cid/products/:pid', CartController.addProductToCart)

router.post('/:cid/purchase', purchase)


router.put('/:cid', CartController.updateCart)

router.put('/:cid/products/:pid', CartController.updateProductQuantity)


router.delete('/:cid', CartController.emptyCart)

router.delete('/:cid/products/:pid', CartController.removeProductFromCart)


router.use(errorHandler)
module.exports = router
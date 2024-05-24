const CartController = require('../controller/cartController')
const {isUser} = require('../middlewares/roleAuth')

const Router = require('express').Router;
const router = Router();


router.get('/', CartController.getAllCarts)

router.get('/:cid', CartController.getCartById);

router.post('/', CartController.createCart);

router.post('/:cid/products', CartController.addProductToCart);

router.post('/:cid/purchase', isUser, CartController.purchaseCart)

router.put('/:cid/products/:pid', CartController.updateProductQuantity)

router.delete('/:cid/products/:pid', CartController.removeProductFromCart)

router.delete('/:cid', CartController.removeAllProductsFromCart);

module.exports = router
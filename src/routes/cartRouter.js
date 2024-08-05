const CartController = require('../controller/cartController')

const Router = require('express').Router;
const router = Router();


router.get('/', CartController.getCarts)

router.get('/:cid', CartController.getCartById);

router.post('/', CartController.createCart);

router.post('/:cid/products', CartController.addProductToCart);

router.post('/:cid/purchase', CartController.emptyCart)

router.put('/:cid/products/:pid', CartController.updateProductQuantity)

router.delete('/:cid/products/:pid', CartController.removeProductFromCart)

module.exports = router
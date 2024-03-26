const CartManager = require('../dao/cartManager.js');
const path = require('path');

const Router = require('express').Router;
const router = Router();

let route = path.join(__dirname, '..', 'data', 'carts.json');
const cm = new CartManager(route);

router.post('/', async (req, res) => {
    try {
        const newCart = await cm.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear un nuevo carrito'
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cm.getCartById(parseInt(cid));

        if (!cart) {
            return res.status(404).json({
                error: 'Carrito no encontrado'
            });
        }

        res.json(cart.products);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los productos del carrito'
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = 1;

        const result = await cm.addProductToCart(parseInt(cid), parseInt(pid), quantity);

        if (result.error) {
            return res.status(400).json({
                error: result.error
            });
        }

        res.status(201).json(result.cart);
    } catch (error) {
        res.status(500).json({
            error: 'Error al agregar el producto al carrito'
        });
    }
});

module.exports = router;
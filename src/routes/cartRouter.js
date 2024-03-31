const CartManager = require('../dao/cartManager.js');
const path = require('path');

const Router = require('express').Router;
const router = Router();
const fs = require('fs')

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

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const result = await cm.removeProductFromCart(parseInt(cid), parseInt(pid));

        if (result.success) {
            return res.json({
                status: 'success',
                message: 'Producto removido del carrito'
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: result.error || 'El carrito especificado no existe o el producto no está en el carrito'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
})

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const newProducts = req.body.products;

        const cart = await cm.getCartById(parseInt(cid));
        if (!cart) {
            return res.status(404).json({ error: 'El carrito especificado no existe' });
        }

        cart.products = newProducts;

        await cm.updateCart(cart);

        return res.json({
            status: 'success',
            message: 'Carrito actualizado correctamente',
            cart: cart
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error interno' });
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
        }

        const cart = await cm.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'El carrito especificado no existe' });
        }

        const productIndex = cart.products.findIndex(product => product.product === pid);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'El producto especificado no está en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;

        await fs.promises.writeFile(route, JSON.stringify(cart, null, 2));

        return res.json({
            status: 'success',
            message: 'Cantidad de ejemplares del producto actualizada correctamente',
            cart: cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error interno' });
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
      
        const cart = await cm.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'El carrito especificado no existe' });
        }

        cart.products = [];

        await cm.updateCart(cid, []);

        return res.json({
            status: 'success',
            message: 'Todos los productos han sido eliminados del carrito',
            cart: cart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'error', message: 'Error interno' });
    }
});

module.exports = router
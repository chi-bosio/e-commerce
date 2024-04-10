const CartManager = require('../dao/cartManager.js');
const {default: mongoose} = require('mongoose')
const path = require('path');

const Router = require('express').Router;
const router = Router();

let route = path.join(__dirname, '..', 'data', 'carts.json');
const cm = new CartManager();

router.post('/', async (req, res) => {
    try {
        await cm.createCart();

        res.json(
            {
                status: 'success',
                message: "Carrito creado con éxito"
            }
        )
    } catch (error) {
        throw new Error('Error al crear un nuevo carrito: ' + error.message);
    }
});

router.get('/:cid', async (req, res) => {

    let { cid } = req.params;

    if(!mongoose.isValidObjectId(cid)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Ingrese un id valido de Mongoose`})
    }

    let cart

    try {
        cart = await cm.getCartById(cid)
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({cart});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        await cm.addProductToCart(cid, pid);

        res.json(
            {
                status: 'success',
                message: "Producto agregado con éxito"
            }
        )
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    
    const { cid, pid } = req.params;

    try {
        
        await cm.removeProductFromCart(cid, pid);
        
        return res.json({
            status: 'success',
            message: 'Producto removido del carrito'
        });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        await cm.updateQuantityProduct(cid, pid, quantity)
        res.json(
            {
                status: 'success',
                message: "La cantidad del producto fue actualizada con éxito"
            }
        )
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

router.delete('/:cid', async (req, res) => {
        
    const cid = req.params.cid;

    try {
        await cm.removeAllProducts(cid);
        
        return res.json({
            status: 'success',
            message: 'Productos removidos del carrito'
        });

    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router
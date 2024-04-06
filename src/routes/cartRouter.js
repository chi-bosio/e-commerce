// const CartManager = require('../dao/cartManager.js');
const CartManagerMONGO = require('../dao/cartManagerMONGO')
const {default: mongoose} = require('mongoose')
const path = require('path');

const Router = require('express').Router;
const router = Router();

let route = path.join(__dirname, '..', 'data', 'carts.json');
const cm = new CartManagerMONGO();

router.post('/', async (req, res) => {
    try {
        const newCart = await cm.createCart();
        res.status(201).json(newCart);
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
        throw new Error('Error al encontrar el carrito: ' + error.message);
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const result = await cm.addProductToCart(cid, pid);

        res.status(201).json(result);
    } catch (error) {
        throw new Error('Error al agregar el producto al carrito: ' + error.message);
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
        throw new Error('Error al eliminar el producto del carrito: ' + error.message);
    }
})

// router.put('/:cid', async (req, res) => {
//     try {
//         const { cid } = req.params;
//         const newProducts = req.body.products;

//         const cart = await cm.getCartById(cid);
//         if (!cart) {
//             return res.status(404).json({ error: 'El carrito especificado no existe' });
//         }

//         cart.products = newProducts;

//         await cm.updateCart(cart);

//         return res.json({
//             status: 'success',
//             message: 'Carrito actualizado correctamente',
//             cart: cart
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ status: 'error', message: 'Error interno' });
//     }
// })

// router.put('/:cid/products/:pid', async (req, res) => {
//     try {
//         const { cid, pid } = req.params;
//         const { quantity } = req.body;

//         if (!Number.isInteger(quantity) || quantity <= 0) {
//             return res.status(400).json({ error: 'La cantidad debe ser un número entero positivo' });
//         }

//         const cart = await cm.getCartById(cid);
//         if (!cart) {
//             return res.status(404).json({ error: 'El carrito especificado no existe' });
//         }

//         const productIndex = cart.products.findIndex(product => product.product === pid);
//         if (productIndex === -1) {
//             return res.status(404).json({ error: 'El producto especificado no está en el carrito' });
//         }

//         cart.products[productIndex].quantity = quantity;

//         await fs.promises.writeFile(route, JSON.stringify(cart, null, 2));

//         return res.json({
//             status: 'success',
//             message: 'Cantidad de ejemplares del producto actualizada correctamente',
//             cart: cart
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'error', message: 'Error interno' });
//     }
// })

// router.delete('/:cid', async (req, res) => {
//     try {
//         const { cid } = req.params;
      
//         const cart = await cm.getCartById(cid);
//         if (!cart) {
//             return res.status(404).json({ error: 'El carrito especificado no existe' });
//         }

//         cart.products = [];

//         await cm.updateCart(cid, []);

//         return res.json({
//             status: 'success',
//             message: 'Todos los productos han sido eliminados del carrito',
//             cart: cart
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ status: 'error', message: 'Error interno' });
//     }
// });

module.exports = router
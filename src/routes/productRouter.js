// const ProductManager = require('../dao/productManager.js')
// const productModel = require('../dao/models/productModel.js')
const path = require('path')
const ProductManagerMONGO = require('../dao/productManagerMONGO');
const productModel = require('../dao/models/productModel');

const Router=require('express').Router;
const router=Router()

// let route = path.join(__dirname,'..', 'data','products.json')
const pm = new ProductManagerMONGO()

router.get('/',async(req,res)=>{
    try {
        const { page = 1, limit = 5, sort = "asc" } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { price: sort === "asc" ? 1 : -1 },
        };

        const products = await productModel.paginate({}, options);
        const jsonProducts = JSON.stringify(products, null, 2); 
        
        res.setHeader("Content-Type", "application/json");
        res.send(jsonProducts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
    
});

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    try {
        let product = await pm.getProductById(pid);
        res.json(product)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, status } = req.body;

    try {
        let product = await pm.addProduct(
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock, 
            category, 
            status
        )

        res.status(201).json(product)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

// router.put('/:pid', async (req, res) => {
//     try {
//         let { pid } = req.params;
//         const { title, description, price, thumbnail, code, stock, status, category } = req.body;

//         pid = Number(pid);
//         if (isNaN(pid)) {
//             return res.status(400).json({
//                 error: 'El id debe ser del tipo numérico'
//             });
//         }
        
//         const result = await pm.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });

//         if (result.error) {
//             return res.status(404).json({ error: result.error });
//         }

//         res.status(200).json({ message: 'Producto actualizado con éxito' });
//     } catch (error) {
//         res.status(500).json({
//             error: `Error al actualizar el producto con id ${pid}` 
//         });
//     }
// });

// router.delete('/:pid', async (req, res) => {
//     try {
//         let { pid } = req.params;
//         pid = Number(pid);

//         if (isNaN(pid)) {
//             return res.status(400).json({
//                 error: 'El id debe ser del tipo numérico'
//             });
//         }

//         let products = await pm.getProducts();
//         let indexProduct = products.findIndex(u => u.id === pid);

//         if (indexProduct === -1) {
//             return res.status(400).json({ error: `No existen productos con id ${pid}` });
//         }

//         await pm.deleteProduct(pid);

//         res.status(200).json({ message: 'Producto eliminado con éxito' });
//     } catch (error) {
//         res.status(500).json({
//             error: `Error al eliminar el producto con id ${pid}`
//         });
//     }
// });

module.exports = router
const ProductManager = require('../managers/productManager.js')
const path = require('path')

const Router=require('express').Router;
const router=Router()

let route = path.join(__dirname,'..', 'data','products.json')
const pm = new ProductManager(route)

router.get('/', async (req, res) => {
    try {
        let limit = req.query.limit;
        let result = await pm.getProducts(); 
        if (limit && limit > 0) {
            result = result.slice(0, limit);
        }

        res.setHeader('Content-Type','application/json');
        return res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Error al obtener los productos' 
        });
    }
});

router.get('/:pid', async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (isNaN(pid)) {
        return res.status(400).json({
            error: 'El id debe ser del tipo numérico'
        });
    }

    try {
        let product = await pm.getProductById(pid);

        res.setHeader('Content-Type','application/json');
        return res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json({
            error: `Error al obtener el producto con id ${pid}` 
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;

        if (!title || !description || !price || !code || !stock) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios' 
            });
        }

        let products = await pm.getProducts()
        let exist = products.find(product => product.code === code)
        if(exist){
            return res.status(400).json({ 
                error: `El producto con code ${code} ya existe...!!` 
            });
        }

        const status = true;
        const category = req.body.category || 'Categoría Predeterminada';

        await pm.addProduct(title, description, price, thumbnail, code, stock, status, category);

        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({
            error: 'Error al crear un nuevo producto' 
        });
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        const productId = Number(pid);
        if (isNaN(productId)) {
            return res.status(400).json({ error: 'El id debe ser numérico' });
        }
        
        const result = await pm.updateProduct(productId, { title, description, price, thumbnail, code, stock, status, category });

        if (result.error) {
            return res.status(404).json({ error: result.error });
        }
        await pm.updateProduct(productId, { title, description, price, thumbnail, code, stock, status, category });

        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        res.status(500).json({
            error: `Error al actualizar el producto con id ${pid}` 
        });
    }
});

module.exports = router
const ProductManager = require('../dao/productManager.js')
const productModel = require('../dao/models/productModel.js')
const path = require('path')

const Router=require('express').Router;
const router=Router()

let route = path.join(__dirname,'..', 'data','products.json')
const pm = new ProductManager(route)

router.get('/', async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        let filter = {};
        if (query) {
            filter = { category: query }; 
        }
        let sortOption = {};
        if (sort === 'asc' || sort === 'desc') {
            sortOption = { price: sort === 'asc' ? 1 : -1 }; 
        }

        const count = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(count / limit);
        const skip = (page - 1) * limit;

        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        const nextPage = page < totalPages ? page + 1 : null;
        const prevPage = page > 1 ? page - 1 : null;
        const hasNextPage = nextPage !== null;
        const hasPrevPage = prevPage !== null;
        const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(
            { 
                status: 'error', message: 'ERROR INTERNO' 
            }
        );
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
        let { pid } = req.params;
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        pid = Number(pid);
        if (isNaN(pid)) {
            return res.status(400).json({
                error: 'El id debe ser del tipo numérico'
            });
        }
        
        const result = await pm.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });

        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        res.status(500).json({
            error: `Error al actualizar el producto con id ${pid}` 
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        let { pid } = req.params;
        pid = Number(pid);

        if (isNaN(pid)) {
            return res.status(400).json({
                error: 'El id debe ser del tipo numérico'
            });
        }

        let products = await pm.getProducts();
        let indexProduct = products.findIndex(u => u.id === pid);

        if (indexProduct === -1) {
            return res.status(400).json({ error: `No existen productos con id ${pid}` });
        }

        await pm.deleteProduct(pid);

        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).json({
            error: `Error al eliminar el producto con id ${pid}`
        });
    }
});

module.exports = router
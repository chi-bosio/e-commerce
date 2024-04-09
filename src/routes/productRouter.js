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

router.put('/:pid', async (req, res) => {
    let pid = req.params.pid;
    const updatedFields = req.body

    try {
        const product = await pm.updateProduct(pid, updatedFields)
        res.json(product)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    let pid = req.params.pid;
    try {
        const product = await pm.deleteProduct(pid)
        res.json(product)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router
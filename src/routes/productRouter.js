const ProductManager = require('../dao/managers/productManager.js');
const userModel = require('../dao/models/userModel.js');
const {ensureAuthenticated, ensureAccess} = require('../middlewares/auth')
const passport = require('passport')

const Router=require('express').Router;
const productModel = require('../dao/models/productModel.js');
const router=Router()

const pm = new ProductManager()

router.get(
    '/',
    ensureAuthenticated,
    ensureAccess(['public']),
    async(req,res)=>{
        let { page = 1, limit = 5, sort, query } = req.query;
        let queryParams = {}

        if(query){
            queryParams = {...queryParams, category: query}
        }

        const offset = (page-1) * limit

        try {
            const tProducts = await productModel.countDocuments(queryParams)
            const tPages = Math.ceil(tProducts/limit)

            let products = await productModel.find(
                queryParams, 
                {}, 
                {
                    skip: offset,
                    limit: parseInt(limit),
                    sort: sort ? {price: sort === 'asc' ? 1 : -1} : {}
                }
            ).lean()

            const response = {
                    status: "success",
                    payload: products,
                    tPages,
                    prevPage: page > 1 ? page - 1 : null,
                    nextPage: page < tPages ? page + 1 : null,
                    page,
                    hasPrevPage: page > 1,
                    hasNextPage: page < tPages,
                    prevLink: page > 1 ? `/?limit=${limit}&page=${page - 1}` : null,
                    nextLink: page < tPages ? `/?limit=${limit}&page=${page + 1}` : null
            };

            res.render("product", { products });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }

    }
);

router.get(
    "/products",
    ensureAuthenticated,
    ensureAccess(["user", "admin"]),
    async (req, res) => {
        let { limit = 10, page = 1, sort, query } = req.query;
        let queryParams = {};

        if (query) {
            queryParams = { ...queryParams, category: query };
        }

        let user = await userModel.findById(req.user.user._id).lean();

        if (!user) {
            return res.send("Usuario no encontrado");
        }

        const offset = (page - 1) * limit;

        try {
            let products = await productModel.find(
                queryParams,
                {},
                {
                    skip: offset,
                    limit: parseInt(limit),
                    sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
                }
            ).lean();

            res.render("product", { products, user });
        } catch (error) {
            res
                .status(500)
                .json({ error: "Error al obtener los productos", error: error.message });
        }
    }
);
  
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
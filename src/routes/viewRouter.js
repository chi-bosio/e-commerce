const Router = require('express').Router;
const io = require('../app.js')
const ProductManager = require('../dao/managers/productManager.js')
const userModel = require('../dao/models/userModel.js')
const {ensureAuthenticated, ensureAccess} = require('../middlewares/auth.js')

const router = Router();
const pm = new ProductManager()

router.get("/", async (req, res) => {
    res.status(200).render('home');
});

router.get(
    "/realtimeproducts",
    ensureAuthenticated,
    ensureAccess(['admin']),
    async (req, res) => {
    const products = await pm.getProduct();

    let user = await userModel.findById(req.user.user._id).lean()
    if(!user){
        res.setHeader("Content-Type", "application/json");
        return res.json('Usuario no encontrado')
    }
    res.status(200).render("realtimeproducts", { products, user });
});

router.post('/realtimeproducts', async (req, res) => {
    const {title, description, code, price, stock, category, thumbnail} = req.boby
    const status = true

    try{
        await pm.addProduct(title, description, code, price, stock, category, thumbnail, status)
        res.status(201).json('Producto agregado')
        io.emit('products', await pm.getProduct())
    } catch(error){
        res.status(400).json({error: 'Error al agregar el producto'})
    }
})

module.exports = router
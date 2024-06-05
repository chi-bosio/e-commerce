const ViewsController = require('../controller/viewsController')
const logger = require('../utils/logger')

const Router = require('express').Router;
const router = Router();

function handleRealTimeProductsSocket(io) {
    io.on('connection', async(socket) => {
        logger.info('Usuario conectado a la ruta /realtimeproducts');
        const products = await ViewsController.getProducts;
        socket.emit('products', products);
    });
}

router.get("/", ViewsController.getHome);

router.get('/products', ViewsController.getProducts)

router.get('/products/:pid', ViewsController.getProductById)

router.get('/cart/:cid', ViewsController.getCartById)

router.get('/login', ViewsController.getLogin)

router.get('/register', ViewsController.getRegister)

router.get('/profile', ViewsController.getProfile)

router.get('/realtimeproducts', ViewsController.getRealTimeProducts)

module.exports = {router, handleRealTimeProductsSocket}
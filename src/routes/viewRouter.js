const ViewsController = require('../controller/viewsController')

const Router = require('express').Router;
const router = Router();

function handleRealTimeProductsSocket(io) {
    io.on('connection', async(socket) => {
        console.log('Usuario conectado a la ruta /realtimeproducts');
        const products = await productManager.getProducts();
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
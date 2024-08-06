const ViewsController = require('../controller/viewsController')
const {auth, admin, users} = require('../middlewares/auth')

const Router = require('express').Router;
const router = Router();

router.get('/products', auth, users, ViewsController.getProducts)

router.get('/carts', auth, ViewsController.getCarts)

router.get('/cart', auth, ViewsController.getCart)

router.get('/products/:pid', auth, ViewsController.getProductById)

router.get('/cart/:cid', auth, admin, ViewsController.getCartById)

router.get('/', ViewsController.getLogin)

router.get('/register', ViewsController.getRegister)

router.get('/realtimeproducts', auth, admin, ViewsController.getRealTimeProducts)

router.get("/chat", users, ViewsController.chat)

router.get('/user', auth, ViewsController.user)

router.get('/mocking', ViewsController.mock)

router.get("/forgotpass", ViewsController.forgotPassword)

router.get("/resetpass", ViewsController.resetPassword)

router.get("/role", ViewsController.role)

router.get("/premium", ViewsController.premium)

router.get("/adminusers", auth, admin, ViewsController.getAdminUsers)

router.get("/details", auth, ViewsController.details)


module.exports = router

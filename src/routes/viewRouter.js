const ViewsController = require('../controller/viewsController')
const {authenticate, admin, user} = require('../middlewares/auth')

const Router = require('express').Router;
const router = Router();

router.get("/", ViewsController.getHome);

router.get('/products', authenticate, user, ViewsController.getProducts)

router.get('/carts', authenticate, ViewsController.getCarts)

router.get('/cart', authenticate, ViewsController.getCart)

router.get('/products/:pid', authenticate, ViewsController.getProductById)

router.get('/cart/:cid', authenticate, admin, ViewsController.getCartById)

router.get('/login', ViewsController.getLogin)

router.get('/register', ViewsController.getRegister)

router.get('/profile', ViewsController.getProfile)

router.get('/realtimeproducts', authenticate, admin, ViewsController.getRealTimeProducts)

router.get("/chat", user, ViewsController.chat)

router.get('/user', authenticate, ViewsController.user)

router.get('/mocking', ViewsController.mock)

router.get("/forgotpass", ViewsController.forgotPassword)

router.get("/resetpass", ViewsController.resetPassword)

router.get("/role", ViewsController.role)

router.get("/premium", ViewsController.premium)

router.get("/adminusers", authenticate, admin, ViewsController.getAdminUsers)

router.get("/details", authenticate, ViewsController.details)


module.exports = router
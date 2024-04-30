const Router = require('express').Router;
const socketIo = require('socket.io')
const ProductManager = require('../dao/managers/productManager.js')
const UserManager = require('../dao/managers/userManager.js') 
const productModel = require('../dao/models/productModel.js')
const cartModel = require('../dao/models/cartModel.js')

const router = Router();
const pm = new ProductManager()
const um = new UserManager()

function handleRealTimeProductsSocket(io) {
    io.on("connection", async (socket) => {
      console.log("Usuario conectado a la WebSocket");
      const products = await pm.getProduct();
      socket.emit("products", products);
    });
}  

router.get("/", async (req, res) => {
    res.status(200).render('home');
});

router.get("/products", async (req, res) => {
    let page = req.query.page;
    if (!page) {
        page = 1;
    }

    let {
        docs: product,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
    } = await productModel.paginate(
        {},
        { limit: 10, page: page, lean: true }
    );

    let messageWelcome = ''
    if(req.session.user){
        try {
            const user = await um.getUserByFilter({username: req.session.user.username})
            if(user.role === 'admin'){
                messageWelcome = `Bienvenido administrador ${user.username}!!`
            } else{
                messageWelcome = `Bienvenido usuario ${user.username}!!`
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener la info del usuario.");
        }
    }
    res.status(200).render("product", {
        product,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        messageWelcome
    });
});

router.get("/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productModel.findById(pid).lean();

        if (!product) {
            return res.status(404).send("El producto no fue encontrado.");
        }

        res.render("productView", { product });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar la solicitud.");
    }
});

router.get("/cart/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const cart = await cartModel
            .findById(cid)
            .populate("product")
            .lean();

        if (!cart) {
            return res.status(404).send("El carrito no fue encontrado.");
        }
        const productsWithDetails = await Promise.all(
            cart.products.map(async (product) => {
                const productDetails = await productModel
                    .findById(product.pid)
                    .lean();

                return {
                    ...product,
                    title: productDetails.title,
                    price: productDetails.price,
                };
            })
        );

        res.render("cart", { cart: { ...cart, products: productsWithDetails } });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar la solicitud.");
    }
});

router.get('/login', async (req, res) => {
    const {message, error} = req.query
    res.status(200).render('login', {message, error})
})

router.get('/register', async (req, res) => {
    const {message, error} = req.query
    res.status(200).render('register', {message, error})
})

router.get('/profile', async (req, res) => {
    if(!req.session.user){
        return res.redirect('/login')
    }
    res.render('profile', {user: req.session.user})
})

router.get("/realtimeproducts", async (req, res) => {
    const products = await pm.getProduct();
    res.status(200).render("realtimeproducts", { products });
});

module.exports = {router, handleRealTimeProductsSocket}
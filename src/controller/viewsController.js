const ProductManager = require('../dao/managers/productManager')
const UserManager = require('../dao/managers/userManager')
const productModel = require('../dao/models/productModel')
const cartModel = require('../dao/models/cartModel')

let um = new UserManager()
let pm = new ProductManager()

class ViewsController{
    static async getHome(req, res){
        res.render('home')
    }

    static async getProducts(req, res){
        let {page} = req.query
        if(!page){
            page = 1
        }

        let {
            docs: products,
            tPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage
        } = await productModel.paginate({}, {limit: 10, page: page, lean: true})
        
        let welcomeMessage = ''
        if(req.session.user){
            try {
                const user = await um.getUserByFilter({username: req.session.user.username})
                if(user.role === 'admin'){
                    welcomeMessage = `Bienvenido ${user.username}. Eres un administrador`
                } else{
                    welcomeMessage = `Bienvenido ${user.username}.`
                }
            } catch (error) {
                res.status(500).json({error: `Error al obtener información del usuario: ${error.message}`})
            }
        }

        res.render('products', {
            products,
            tPages,
            prevPage,
            nextPage,
            hasPrevPage,
            hasNextPage,
            welcomeMessage
        })
    }

    static async getProductById(req, res){
        try {
            const {pid} = req.params
            const product = await productModel.findById(pid).lean()
            if(!product){
                return res.send(`Producto con ID ${pid} no encontrado`)
            }
            res.render('singleproduct', {product})
        } catch (error) {
            res.status(500).json({error: `Error al obtener el producto con ID ${pid}: ${error.message}`})
        }
    }

    static async getCartById(req, res){
        try {
            const {cid} = req.params
            const cart = await cartModel.findById(cid).populate('products').lean()
            if(!cart){
                return res.send('El carrito no fue encontrado')
            }

            const productsDetails = await Promise.all(cart.products.map(async p => {
                const productDetails = await productModel.findById(p.pid).lean()
                return{
                    ...p,
                    title: productDetails.title,
                    price: productDetails.price
                }
            }))

            res.render('cart', {cart: {...cart, products: productsDetails}})
        } catch (error) {
            res.status(500).json({error: `Error al obtener el carrito con ID ${cid}: ${error.message}`})
        }
    }

    static async getLogin(req, res){
        let {message, error} = req.query
        res.render('login', {message, error})
    }

    static async getRegister(req, res){
        let {message, error} = req.query
        res.render('register', {message, error})
    }

    static async getProfile(req, res){
        if(!req.session.user){
            return res.redirect('/login')
        }
        res.render('profile', {user: req.session.user})
    }

    static async getRealTimeProducts(req, res){
        const products = await pm.getProduct()
        res.render('realtimeproducts', {products})
    }
}

module.exports = ViewsController
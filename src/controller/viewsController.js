const productModel = require('../dao/models/productModel')
const cartModel = require('../dao/models/cartModel')
const userModel = require('../dao/models/userModel')
const {ProductRepository, TicketRepository} = require('../services/service')
const {generateMockProducts} = require('../mocks/mocking')
const customError = require('../services/errors/customError')
const errorList = require('../services/errors/errorList')
const UserDAO = require('../dao/userDao')
const userDAO = new UserDAO()

class ViewsController{
    static async getHome(req, res){
        res.render('home')
    }

    static async getProducts(req, res){
        let {page = 1, limit = 10, query, sort} = req.query
        const dataUser = req.session.user._id

        try {
            const user = await userModel.findById(dataUser)

            const isAdmin = user.role === 'admin'
            const isUser = user.role === 'user'
            const isPremium = user.role === 'premium'
            const username = user.username
            const userCart = req.session.user.cart
            const email = user.email

            const cartUser = await cartModel
                                    .findById(userCart)
                                    .populate(
                                            'products.pid',
                                            '_id title price description category code stock thumbnail'
                                    )
                                    .lean()
            const totalQuantity = cartUser.products.reduce((acc, i) => acc + i.quantity, 0)

            let filter = {}
            if(query && query !== ''){
                filter = {category: query}
            }

            let sortOpt = {}
            switch(sort){
                case 'asc':
                    sortOpt = {'price': 1}
                    break
                case 'desc':
                    sortOpt = {'price': -1}
                    break
                default:
                    sortOpt = undefined
                    break
            }

            const result = await productModel.paginate(filter, {limit, page: Number(page), sort: sortOpt, lean: true}) 
            const {
                docs: products,
                totalPages: tPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage
            } = result

            let welcomeMessage = ''
            if(req.session.user){
                try {
                    const user = await userDAO.getUserBy({username: req.session.user.username})
                    if(user.role === 'admin'){
                        welcomeMessage = `Bienvenido/a ${user.username}. Eres un administrador`
                    } else if(user.role === 'premium'){
                        welcomeMessage = `Bienvenido/a ${user.username}. Eres un premium`
                    } else{
                        welcomeMessage = `Bienvenido/a ${user.username}.`
                    }
                } catch (error) {
                    req.logger.error(`Error al obtener información del usuario: ${error}`)
                }
            }

            res.setHeader("Content-Type", "text/html");
            res.status(200).render('products', {
                status: 'success',
                payload: products,
                user, email, username,
                totalQuantity, userCart,
                isPremium, isAdmin, isUser,
                tPages, prevPage, nextPage,
                page: currentPage, hasPrevPage, hasNextPage,
                prevLink: page > 1 ? `/?page=${page - 1}` : null,
                nextLink: page < tPages ? `/?page=${page + 1}` : null,
                products, welcomeMessage
            })
        } catch (error) {
            req.logger.error(`Error al obtener los productos 2: ${error.message}`);
            res.status(500).send('Error interno');
        }
    }

    static async getCarts(req, res){
        try {
            let dataUser = req.session.user._id
            let user = await userModel.findById(dataUser)

            const isAdmin = user.role === 'admin'
            const isUser = user.role === 'user'
            const isPremium = user.role === 'premium'

            const cid = req.session.user.cart
            const role = user.role
            const username = user.username
            const email = user.email
            const carts = await cartModel
                                .find()
                                .populate(
                                        'products.pid',
                                        '_id title price description category code stock thumbnail'
                                )
                                .lean()

            res.setHeader("Content-Type", "text/html")
            res.status(200).render(
                'carts', {
                    carts, user,
                    isAdmin, isUser, isPremium,
                    cid, role, username, email
                }
            )
        } catch (error) {
            req.logger.error(`Error al obtener los carritos: ${error.message}`)
            res.status(500).send('Error interno')
        }
    }

    static async getCart(req, res){
        let dataUser = req.session.user._id
        let user = await userModel.findById(dataUser)

        const isAdmin = user.role === 'admin'
        const isUser = user.role === 'user'
        const isPremium = user.role === 'premium'

        const cid = req.session.user.cart
        const role = user.role
        const username = user.username
        const email = user.email
        const userCart = await cartModel
                                .findById(cid)
                                .populate(
                                        'products.pid',
                                        '_id title price description category code stock thumbnail'
                                )
                                .lean()
        const totalQuantity = userCart.products.reduce((acc, i) => acc + i.quantity, 0)

        res.setHeader("Content-Type", "text/html")
        res.status(200).render(
            'cart', {
                totalQuantity, userCart, user,
                isAdmin, isUser, isPremium,
                cid, role, username, email
            }
        )
    }

    static async getProductById(req, res){
        try {
            let dataUser = req.session.user._id
            let user = await userModel.findById(dataUser)
            const isAdmin = user.role === 'admin'
            let email = user.email
            const {pid} = req.params
            const userCart = req.session.user.cart
            const product = JSON.parse(JSON.stringify(await ProductRepository.getProductById(pid)))
            
            res.setHeader("Content-Type", "text/html")
            res.render('productdetail', {product, user, isAdmin, userCart, email})
        } catch (error) {
            req.logger.error(`Error al obtener el producto con ID ${pid}: ${error.message}`)
            res.status(500).send('Error al procesar la solicitud')
        }
    }

    static async getCartById(req, res, next){
        try {
            const {cid} = req.params
            const {user} = req.session
            const isAdmin = user.role === 'admin'
            const cart = await cartModel
                                .findById(cid)
                                .populate(
                                    'products.pid',
                                    '_id title price description category code stock thumbnail'
                                )
                                .lean()

            if(!cart){
                throw new customError(errorList.CART_NOT_FOUND)
            }

            const tCart = cart.products.reduce((acc, p) => acc + p.product.price * p.quantity, 0)

            res.setHeader("Content-Type", "text/html")
            res.status(200).render('cartdetail', {cart, tCart, user, isAdmin})
        } catch (error) {
            next()
        }
    }

    static async getLogin(req, res){
        const port = req.socket.localPort || 8080
        res.status(200).render('login', {port})
    }

    static async getRegister(req, res){
        let {message, error} = req.query
        res.status(200).render('register', {message, error})
    }

    static async getProfile(req, res){
        if(!req.session.user){
            return res.redirect('/login')
        }
        res.render('profile', {user: req.session.user})
    }

    static async getRealTimeProducts(req, res){
        let user = req.session.user
        const isAdmin = user.role === 'admin'

        res.render('realtimeproducts', {user, isAdmin})
    }

    static async chat(req, res){
        res.render('chat')
    }

    static async user(req, res){
        let dataUser = req.session.user._id
        let user = await userModel.findById(dataUser)

        const isAdmin = user.role === 'admin'
        const isUser = user.role === 'user'
        const isPremium = user.role === 'premium'

        const cid = req.session.user.cart
        const role = user.role
        const username = user.username
        const email = user.email

        const userCart = await cartModel
                                .findById(cid)
                                .populate(
                                        'products.pid',
                                        '_id title price description category code stock thumbnail'
                                )
                                .lean()
        const totalQuantity = userCart.products.reduce((acc, i) => acc + i.quantity, 0)

        res.setHeader("Content-Type", "text/html")
        res.status(200).render(
            'user', {
                totalQuantity, user,
                isAdmin, isUser, isPremium,
                role, username, email
            }
        )
    }

    static async mock(req, res){
        const mockProducts = generateMockProducts()
        const cid = req.session.user.cart

        res.setHeader("Content-Type", "text/html")
        res.status(200).render('mock', {products: mockProducts, cid})
    }

    static async forgotPassword(req, res){
        res.status(200).render('forgotpass')
    }

    static async resetPassword(req, res){
        const {token} = req.query
        res.status(200).render('resetpass', {token})
    }

    static async role(req, res){
        let dataUser = req.session.user._id
        let user = await userModel.findById(dataUser)
        let role = user.role
        let uid = user._id

        const isAdmin = user.role === 'admin'
        const isUser = user.role === 'user'
        const isPremium = user.role === 'premium'
        res.status(200).render('role', {role, uid, isAdmin, isUser, isPremium})
    }

    static async premium(req, res){
        let dataUser = req.session.user._id
        let user = await userModel.findById(dataUser)
        let role = user.role
        let uid = user._id
        let email = user.email

        const isAdmin = user.role === 'admin'
        const isUser = user.role === 'user'
        const isPremium = user.role === 'premium'

        const products = await productModel.find({owner: email}).lean()
        res.status(200).render('premium', {user, products, role, uid, isAdmin, isUser, isPremium})
    }

    static async getAdminUsers(req, res){
        try {
            const users = await userModel.find().lean()
            res.status(200).render('adminusers', {users})
        } catch (error) {
            req.logger.error(`Error al obtener los usuarios de los admin: ${error.message}`)
            res.status(500).send('Error interno')
        }
    }

    static async details(req, res){
        try {
            const uid = req.user._id
            const latestTicket = await TicketRepository.getLatestTicketByUser(uid)
            if(latestTicket){
                res.status(200).render('details', {ticket: latestTicket, user: req.user})
            } else{
                res.status(404).send('No se encontró ticket para el usuario')
            }
        } catch (error) {
            req.logger.error(`Error al obtener los detalles: ${error.message}`)
            res.status(500).send('Error interno')
        }
    }
}

module.exports = ViewsController
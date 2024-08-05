const ProductDAO = require('../dao/productDao')
const {devLogger} = require('../config/logger')

const productDAO = new ProductDAO(__dirname + '/data/products.json')

const socketProducts = (socketServer) => {
    socketServer.on('connection', async (socket) => {
        devLogger.info(`Cliente con ID ${socket.id} conectado`)
        const listProducts = await productDAO.getProduct()

        socketServer.emit("sendProduct", listProducts)

        socket.on("addProduct", async (obj) => {
            await productDAO.addProduct(obj)
            const listProducts = await productDAO.getProduct()
            socketServer.emit("sendProduct", listProducts)
        })

        socket.on("deleteProduct", async (id) => {
            await productDAO.deleteProduct(id)
            const listProducts = await productDAO.getProduct()
            socketServer.emit("sendProduct", listProducts)
        })
    })
}

module.exports = socketProducts
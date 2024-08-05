const ticketModel = require('./models/ticketModel')
const cartModel = require('./models/cartModel')
const productModel = require('./models/productModel')
const userModel = require('./models/userModel')

class TicketDAO {
    async createTicket(uid, cid){
        try {
            const cart = await cartModel.findOne({_id: cid})
            if(!cart || cart.products.length === 0){
                throw new Error('No existen productos en el carrito para crear el ticket')
            }

            const {availableProducts, unavailableProducts} = await this.checkStock(cart.products)
            if(availableProducts.length === 0){
                throw new Error('Stock insuficiente')
            }

            const user = await userModel.findById(uid)
            const ticket = new ticketModel({
                purchase_datetime: new Date(),
                amount: this.calculateTotalAmount(availableProducts),
                purchaser: uid,
                products: availableProducts
            })
            await ticket.save()
            await this.updateStock(availableProducts)

            await cartModel.findOneAndUpdate({_id: cid}, {$set: {products: unavailableProducts}})
            return {ticket, unavailableProducts}
        } catch (error) {
            req.logger.error(`Error al crear el ticket: ${error.message}`)
            throw new Error('Error al crear el ticket. Consultar registros para más información.')
        }
    }

    async checkStock(products){
        try {
            const availableProducts = []
            const unavailableProducts = []

            for(const i of products){
                const product = await productModel.findById(i.product)
                if(product && product.stock >= i.quantity){
                    availableProducts.push(i)
                } else{
                    unavailableProducts.push({
                        product: i.product,
                        quantity: product ? i.quantity - product.stock : i.quantity 
                    })
                }
            }
            return {availableProducts, unavailableProducts}
        } catch (error) {
            req.logger.error(`Error al verificar stock: ${error.message}`)
            throw error
        }
    }

    async updateStock(products){
        try {
            for(const i of products){
                await productModel.findByIdAndUpdate(i.product._id, {$inc: {stock: -i.quantity}})
            }
        } catch (error) {
            req.logger.error(`Error al actualizar stock: ${error.message}`)
            throw error
        }
    }

    async getLatestTicketByUser(uid) {
        try {
            const latestTicket = await ticketModel.findOne({ purchaser: uid }).sort({ createdAt: -1 }).lean();
            return latestTicket;
        } catch (error) {
            req.logger.error(`Error al obtener el último ticket del usuario: ${error.message}`)
            throw error
        }
    }

    async getTicketsByUser(uid) {
        try {
            const user = await userModel.findById(uid);
            if (!user) {
                return [];
            }

            const tickets = await ticketModel.find({ purchaser: user.email });
            return tickets;
        } catch (error) {
            req.logger.error(`Error al obtener los tickets: ${error.message}`)
            throw error
        }
    }

    calculateTotalAmount(products) {
        return products.reduce((total, i) => {
            const price = i.product.price;
            const quantity = i.quantity;
            return total + price * quantity;
        }, 0);
    }
}

module.exports = TicketDAO
const ticketModel = require('./models/ticketModel')
const cartModel = require('./models/cartModel')
const productModel = require('./models/productModel')
const userModel = require('./models/userModel')

class TicketDAO {
    async createTicket(uid, cid) {
        try {

            const cart = await cartModel.findOne({_id: cid});

            if (!cart || cart.products.length === 0) {
                throw new Error('No existen productos en el carrito para crear el ticket');
            }

            const { availableProducts, unavailableProducts } = await this.checkStock(cart.products)

            if (availableProducts.length === 0) {
                throw new Error('Stock insuficiente')
            }

            const user = await userModel.findById(uid)

            const totalAmount = this.calculateTotalAmount(availableProducts)

            const ticket = new ticketModel({
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: uid,
                products: availableProducts.map(p => ({
                    product: p.product._id,
                    quantity: p.quantity
                }))
            });

            await ticket.save()

            await this.updateStock(availableProducts)

            await cartModel.findOneAndUpdate({_id: cid}, {$set: {products: unavailableProducts}})

            return { ticket, unavailableProducts };
        } catch (error) {
            throw new Error(`Error al crear el ticket: ${error.message}`);
        }
    }

    async checkStock(products){
        try {

            const availableProducts = [];
            const unavailableProducts = [];

            for (const i of products) {
                const productId = i.pid;

                const product = await productModel.findById(productId)

                if (product && product.stock >= i.quantity) {
                    availableProducts.push({ ...i, product });
                } else {
                    unavailableProducts.push({
                        pid: productId,
                        quantity: product ? i.quantity - product.stock : i.quantity 
                    });
                }
            }

            return { availableProducts, unavailableProducts };
        } catch (error) {
            console.error(`Error al verificar el stock: ${error.message}`);
            throw new Error(`Error al verificar el stock: ${error.message}`);
        }
    }
    
    async updateStock(products){
        try {
            for (const product of products) {
                await productModel.findByIdAndUpdate(product.pid, { $inc: { stock: -product.quantity } });
            }
        } catch (error) {
            throw new Error(`Error al actualizar el stock: ${error.message}`);
        }
    }

    async getLatestTicketByUser(uid) {
        try {
            const latestTicket = await ticketModel.findOne({ purchaser: uid }).sort({ createdAt: -1 }).lean()
            return latestTicket;
        } catch (error) {
            throw new Error(`Error al obtener el último ticket del usuario: ${error.message}`);
        }
    }

    async getTicketsByUser(uid) {
        try {
            const user = await userModel.findById(uid)
            if (!user) {
                return []
            }

            const tickets = await ticketModel.find({ purchaser: user.email })
            return tickets;
        } catch (error) {
            throw new Error(`Error al obtener los tickets: ${error.message}`)
        }
    }

    calculateTotalAmount(products) {
        try {
            let total = 0;
            for (const product of products) {
                if (!product.product || !product.product.price || !product.quantity) {
                    throw new Error('Datos de producto inválidos para el cálculo');
                }
                total += product.product.price * product.quantity;
            }
            return total;
        } catch (error) {
            throw new Error(`Error al calcular el total: ${error.message}`)
        }
    }
}

module.exports = TicketDAO

const cartModel = require("./models/cartModel");

class CartDAO{

    async createCart() {
        try {

            let newCart=await cartModel.create({products: []})

            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async getCartById(cid) {
        try {

            let cart=await cartModel.findById(cid)
            
            if (!cart) {
                return null;
            }
    
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito: " + error.message);
        }
    }
    
    async addProductToCart(cid, pid, quantity) {
        
        try {
            let carts = await cartModel.findById(cid);

            if (!carts) {
                return { error: `Carrito con ID ${cid} no encontrado`};
            }

            const existingProduct = carts.products.find(p => p.pid === pid);
            
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                carts.products.push({
                    pid: pid,
                    quantity: 1
                });
            }
            await carts.save()

            return carts
        } catch (error) {
            throw new Error("Error al crear el producto en el carrito: " + error.message);
        }
    }

    async removeProductFromCart(cid, pid) {
        try {
            let carts = await cartModel.findById(cid);

            if (!carts) {
                throw new Error('Carrito no encontrado')
            }

            const exist = carts.products.find(p => p.product.equals(pid))

            if(!exist){
                throw new Error('El producto no existe en el carrito')
            }

            carts.products = carts.products.filter(
                p => !p.product.equals(pid)
            )

            await carts.save()

            return carts
        } catch (error) {
            throw new Error("Error al eliminar el producto en el carrito: " + error.message);
        }
    }

    async updateQuantityProduct(cid, pid, quantity) {
        try {
            let carts = await cartModel.findById(cid);

            if (!carts) {
                throw new Error('Carrito no encontrado')
            }

            const productUpdate = carts.products.find(
                p => p.product.equals(pid)
            )

            if(!productUpdate){
                throw new Error('Producto no encontrado')
            }

            productUpdate.quantity = quantity

            await carts.save()

            return carts
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    }

    async emptyCarts(cid){
        try {
            let cart = await cartModel.findByIdAndUpdate(cid, {products: []}, {new: true})
            if(!cart){
                throw new Error('Carrito no encontrado')
            }
            return cart
        } catch (error) {
            throw new Error("Error al vaciar el carrito desde Cart Dao: " + error.message)
        }
    }
}

module.exports = CartDAO;
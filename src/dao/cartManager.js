const cartModel = require("./models/cartModel");
const productModel= require("./models/productModel")

class CartManagerMONGO {

    async createCart() {
        try {

            let newCart=await cartModel.create({products: []})

            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async getCartById(id) {
        try {

            let cart=await cartModel.findOne({_id:id}).populate("products.product")
            
            if (!cart) {
                return null;
            }
    
            return cart;
        } catch (error) {
            throw new Error("Error al obtener el carrito: " + error.message);
        }
    }
    
    async addProductToCart(cid, pid) {
        
        try {
            let carts = await cartModel.findById(cid);

            if (!carts) {
                return { error: 'Carrito no encontrado' };
            }

            const existingProduct = carts.products.find(p => p.product === pid);
            
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                carts.products.push({
                    product: pid,
                    quantity: 1
                });
            }
            await carts.save()

            return carts.products.find(p => p.product === pid)
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

    async removeAllProducts(cid){
        try {
            let carts = await cartModel.findById(cid);

            if (!carts) {
                throw new Error('Carrito no encontrado')
            }

            carts.products = []

            await carts.save()

            return carts
        } catch (error) {
            throw new Error("Error al eliminar todos los productos del carrito: " + error.message);
        } 
    }
}

module.exports = CartManagerMONGO;
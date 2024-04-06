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

//     async getCarts() {
//         if (fs.existsSync(this.path)) {
//             return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }));
//         } else {
//             return [];
//         }
//     }

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

//     async updateCart(cartId, newProducts) {
//         try {
//             let carts = await this.getCarts();
    
//             const cartIndex = carts.findIndex(cart => cart.id === cartId);
//             if (cartIndex === -1) {
//                 return { success: false, error: 'El carrito no existe' };
//             }
    
//             carts[cartIndex].products = newProducts;
    
//             await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    
//             return { success: true };
//         } catch (error) {
//             throw error;
//         }
//     }
}

module.exports = CartManagerMONGO;
const cartModel = require("./models/cartModel");
const productModel= require("./models/productModel")

class CartManagerMONGO {


    async createCart() {
        try {

            let newCart=await cartModel.create({products:[]})

            return newCart;
        } catch (error) {
            throw error;
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
            throw error;
        }
    }
    

//     async addProductToCart(cartId, productId, quantity) {
//         try {
//             let carts = await this.getCarts();

//             const cart = carts.find(c => c.id === cartId);

//             if (!cart) {
//                 return { error: 'Carrito no encontrado' };
//             }

//             const existingProduct = cart.products.find(p => p.product === productId);

//             if (existingProduct) {
//                 existingProduct.quantity += quantity;
//             } else {
//                 cart.products.push({
//                     product: productId,
//                     quantity
//                 });
//             }

//             await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

//             return { cart };
//         } catch (error) {
//             throw error;
//         }
//     }

//     async getCarts() {
//         if (fs.existsSync(this.path)) {
//             return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }));
//         } else {
//             return [];
//         }
//     }

//     async removeProductFromCart(cartId, productId) {
//         try {
//             let carts = await this.getCarts();
    
//             const cart = carts.find(c => c.id === cartId);
    
//             if (!cart) {
//                 return { success: false, error: 'Carrito no encontrado' };
//             }
    
//             const initialProductsLength = cart.products.length;
    
//             cart.products = cart.products.filter(product => product.product !== productId);
    
//             if (cart.products.length < initialProductsLength) {
//                 await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    
//                 return { success: true };
//             } else {
//                 return { success: false, error: 'El producto no está en el carrito' };
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

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
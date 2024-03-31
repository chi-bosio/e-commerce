const fs = require('fs');

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
        try {
            let carts = await this.getCarts();

            const newCart = {
                id: carts.length + 1,
                products: []
            };

            carts.push(newCart);

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            let carts = await this.getCarts();
    
            const cart = carts.find(c => c.id === id);
    
            if (!cart) {
                return null; // No se encontró el carrito
            }
    
            // Aquí es donde se realizará el "populate" de los productos
            const populatedProducts = await this.populateProducts(cart.products);
    
            // Reemplaza los IDs de productos con los detalles completos de productos poblados
            cart.products = populatedProducts;
    
            return cart;
        } catch (error) {
            throw error;
        }
    }
    
    async populateProducts(pid) {
        const products = [
            { id: 1, name: 'Product 1', price: 10 },
            { id: 2, name: 'Product 2', price: 20 },
            { id: 3, name: 'Product 3', price: 30 }
        ];
    
        const populatedProducts = products.filter(p => pid.includes(p.id));
    
        return populatedProducts;
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            let carts = await this.getCarts();

            const cart = carts.find(c => c.id === cartId);

            if (!cart) {
                return { error: 'Carrito no encontrado' };
            }

            const existingProduct = cart.products.find(p => p.product === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({
                    product: productId,
                    quantity
                });
            }

            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

            return { cart };
        } catch (error) {
            throw error;
        }
    }

    async getCarts() {
        if (fs.existsSync(this.path)) {
            return JSON.parse(await fs.promises.readFile(this.path, { encoding: 'utf-8' }));
        } else {
            return [];
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            let carts = await this.getCarts();
    
            const cart = carts.find(c => c.id === cartId);
    
            if (!cart) {
                return { success: false, error: 'Carrito no encontrado' };
            }
    
            const initialProductsLength = cart.products.length;
    
            cart.products = cart.products.filter(product => product.product !== productId);
    
            if (cart.products.length < initialProductsLength) {
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    
                return { success: true };
            } else {
                return { success: false, error: 'El producto no está en el carrito' };
            }
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, newProducts) {
        try {
            let carts = await this.getCarts();
    
            const cartIndex = carts.findIndex(cart => cart.id === cartId);
            if (cartIndex === -1) {
                return { success: false, error: 'El carrito no existe' };
            }
    
            carts[cartIndex].products = newProducts;
    
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    
            return { success: true };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = CartManager;
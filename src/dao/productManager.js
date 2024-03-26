const fs = require('fs')

class ProductManager{
    constructor(path){
        this.path = path
    }

    async addProduct(title, description, price, thumbnail, code, stock, status = true, category){
        let products = await this.getProducts()

        try {
            let id = 1
            if(products.length > 0){
                id = products[products.length -1].id +1
            }
            let newProduct = {id, title, description, price, thumbnail, code, stock, status, category}
            products.push(newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            
        } catch (error) {
            throw error;
        }
        
    }

    async getProducts(){
        if(fs.existsSync(this.path)){
            return JSON.parse(await fs.promises.readFile(this.path, {encoding: 'utf-8'}))
        } else{
            return []
        }
        
    }

    async getProductById(id){

        try {
            let products = await this.getProducts()

            let product = products.find(p => p.id === id)
            if(!product){
                return {error: `No existe producto con id: ${id}`}; 
            }
            return product
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await this.getProducts();
    
            const productIndex = products.findIndex(p => p.id === id);
    
            if (productIndex === -1) {
                return { error: `No existe producto con id: ${id}` };
            }
    
            products[productIndex] = { ...products[productIndex], ...updatedFields };
    
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    
            return { message: `Producto con id ${id} actualizado correctamente.` };
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id){
        try {
            let products = await this.getProducts();
    
            const index = products.findIndex(p => p.id === id);
    
            if (index !== -1) {
    
                products.splice(index, 1);
    
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProductManager
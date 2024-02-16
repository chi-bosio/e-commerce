const fs = require('fs')

class ProductManager{
    constructor(path){
        this.path = path
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        let products = await this.getProducts()

        try {
            let exist = products.find(product => product.code === code)
            if(exist){
                console.log(`El producto con code ${code} ya existe...!!`);
                return
            }

            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log("Todos los campos son obligatorios")
                return
            }

            let id = 1
            if(products.length > 0){
                id = products[products.length -1].id +1
            }
            let newProduct = {id, title, description, price, thumbnail, code, stock}
            products.push(newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
            
        } catch (error) {
            console.log(error.message);
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
            console.log(error.message);
            throw error
        }
    }

    async updateProduct(id, fieldToUpdate, value) {
        try {
            let products = await this.getProducts();
    
            let productIndex = -1;
    
            let updatedProduct = products.map((p, index) => {
                if (p.id === id) {
                    p[fieldToUpdate] = value;
                    productIndex = index; // Guarda el índice del producto encontrado
                }
                return p;
            });
    
            if (productIndex === -1) {
                console.log(`No se encontró un producto con id ${id}`);
                return;
            }
    
            await fs.promises.writeFile(this.path, JSON.stringify(updatedProduct, null, 2), 'utf-8');
            console.log(`Producto con id ${id} actualizado correctamente.`);
        } catch (error) {
            console.log(`Error al actualizar el producto con id ${id}: ${error.message}`);
        }
    }

    async deleteProduct(id){
        try {
            let products = await this.getProducts();
    
            const index = products.findIndex(p => p.id === id);
    
            if (index !== -1) {
    
                products.splice(index, 1);
    
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
                console.log(`El producto con id ${id} se eliminó con éxito!!`);
            } else {
                console.log(`No se encontró un producto con id ${id}.`);
            }
        } catch (error) {
            console.error(`Error al eliminar el producto con id ${id}: ${error.message}`);
        }
    }
}

module.exports = ProductManager;
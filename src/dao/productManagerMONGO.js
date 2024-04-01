const productModel = require("./models/productModel");


class ProductManagerMONGO{

    async addProduct(product){
        try {
            let newProduct=await productModel.create(product)

            return newProduct
            
        } catch (error) {
            throw error;
        }
    }

    async getProducts(){
        return await productModel.paginate({},{lean:true})
    }

    async getProductById(id){

        return productModel.findOne({_id:id})
    }

    // async updateProduct(id, updatedFields) {
    //     try {
    //         let products = await this.getProducts();
    
    //         const productIndex = products.findIndex(p => p.id === id);
    
    //         if (productIndex === -1) {
    //             return { error: `No existe producto con id: ${id}` };
    //         }
    
    //         products[productIndex] = { ...products[productIndex], ...updatedFields };
    
    //         await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    
    //         return { message: `Producto con id ${id} actualizado correctamente.` };
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async deleteProduct(id){
    //     try {
    //         let products = await this.getProducts();
    
    //         const index = products.findIndex(p => p.id === id);
    
    //         if (index !== -1) {
    
    //             products.splice(index, 1);
    
    //             await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = ProductManagerMONGO
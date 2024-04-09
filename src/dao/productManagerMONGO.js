const productModel = require("./models/productModel");


class ProductManagerMONGO{

    async addProduct(title, description, price, thumbnail, code, stock, category, status){
        try {
            let newProduct = await productModel.create({
                title: title, 
                description: description, 
                price: price, 
                thumbnail: thumbnail, 
                code: code, 
                stock: stock, 
                category: category, 
                status: status
            })

            return newProduct
            
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }
    }

    async getProducts(limit = 5){
        try {
            const products = await productModel.find().limit(limit)
            return products
        } catch (error) {
            throw new Error("Error al obtener los productos: " + error.message);
        }
        
    }

    async getProductById(id){
        try {
            const product = await productModel.findById({_id: id})
            return product
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            let products = await productModel.findOneAndUpdate(
                {_id: id},
                updatedFields,
                {new: true}
            );
    
            if(!products){
                throw new Error('Producto no encontrado')
            }

            return { message: `Producto con id ${id} actualizado correctamente.` };
        } catch (error) {
             throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

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
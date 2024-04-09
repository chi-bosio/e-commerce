const productModel = require("./models/productModel");


class ProductManagerMONGO{

    async addProduct(title, description, price, thumbnail, code, stock, category, status){
        try {
            await productModel.create({
                title: title, 
                description: description, 
                price: price, 
                thumbnail: thumbnail, 
                code: code, 
                stock: stock, 
                category: category, 
                status: status
            })

            return { message: `Producto agregado con éxito!!` };
            
        } catch (error) {
            throw new Error("Error al agregar el producto: " + error.message);
        }
    } 

    async getProductById(id){
        try {
            const product = await productModel.findById({_id: id})
            return { message: `Producto con id ${id} encontrado!!
                        ${product}` };
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

    async deleteProduct(id){
        try {
            let product = await productModel.findByIdAndDelete({
                _id: id
            });
    
           if(!product){
            throw new Error('Producto no encontrado')
           }

            return { message: `Producto con id ${id} eliminado correctamente.` };
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
       }
    }
}

module.exports = ProductManagerMONGO
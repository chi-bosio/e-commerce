const productModel = require("./models/productModel");
const logger = require('../utils/logger')


class ProductDAO{
    constructor(){
        
    }
    
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

    async getProduct(limit = 10) {
        try {
            const products = await productModel.find().limit(limit);
            return products;
        } catch (error) {
            throw new Error("Error al obtener los productos");
        }
    }

    async getProductById(id){
        try {
            const product = await productModel.findById({_id: id})
            return product;
        } catch (error) {
            logger.error(`Error al obtener el producto: ${error.message}`)
            throw error;
        }
    }

    async getProductFiltered(category = null){
        try {
            let filter = {}
            if(category){
                filter.category = category
            }
            return await productModel.find(filter).lean()
        } catch (error) {
            return error
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

module.exports = ProductDAO
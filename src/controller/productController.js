const {productModel} = require('../dao/models/productModel')
const ProductService = require('../services/productService')
const ProductDTO = require('../dto/productDTO')

class ProductController{
    static async getAllProducts(req, res){
        try {
            const {page = 1, limit = 10} = req.query
            const options = {
                page: parseInt(page),
                limit: parseInt(limit)
            }

            const products = await productModel.paginate({}, options)
            res.json(products)
        } catch (error) {
            res.status(500).json({error: `Error al obtener los productos: ${error.message}`})   
        }
    }

    static async getProductById(req, res){
        const {pid} = req.params
        try {
            const product = await ProductService.getProductById(pid)
            res.json(product)
        } catch (error) {
            res.status(500).json({error: `Error al obtener el producto con ID ${pid}: ${error.message}`})   
        }
    }

    static async createProduct(req, res){
        try {
            const productData = new ProductDTO(req.body)

            const newProduct = await ProductService.addProduct(productData)
            res.json(newProduct)
        } catch (error) {
            res.status(500).json({error: `Error al crear el producto: ${error.message}`})   
        }
    }

    static async updateProduct(req, res){
        const {pid} = req.params
        const updatedFields = req.body

        try {
            const updatedProduct = await ProductService.updateProduct(pid. updatedFields)
            res.json(updatedProduct)
        } catch (error) {
            res.status(500).json({error: `Error al actualizar el producto: ${error.message}`})   
        }
    }

    static async deleteProduct(req, res){
        const {pid} = req.params

        try {
            await ProductService.deleteProducts(pid)
            res.json({message: 'Producto eliminado con éxito'})
        } catch (error) {
            res.status(500).json({error: `Error al eliminar el producto: ${error.message}`})   
        }
    }
}

module.exports = ProductController
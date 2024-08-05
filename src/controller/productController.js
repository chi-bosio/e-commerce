const productModel = require('../dao/models/productModel')
const ProductRepository = require('../services/repository/productRepository')
const ProductDTO = require('../services/dto/productDTO')
const generateMockProducts = require('../mocks/mocking')
const CustomError = require('../services/errors/customError')
const errorList = require('../services/errors/errorList')
const logger = require('../config/logger')

class ProductController{
    static async getAllProducts(req, res){
        try {
            const {page = 1, limit = 10} = req.query
            const options = {
                page: parseInt(page),
                limit: parseInt(limit)
            }

            const products = await productModel.paginate({}, options)
            res.status(200).json(products)
        } catch (error) {
            res.status(500).json({error: `Error al obtener los productos: ${error.message}`})   
        }
    }

    static async getProductById(req, res, next){
        const {pid} = req.params
        try {
            const product = await ProductRepository.getProductById(pid)
            if(!product){
                throw new CustomError(
                    errorList.PRODUCT_NOT_FOUND.status,
                    errorList.PRODUCT_NOT_FOUND.code,
                    errorList.PRODUCT_NOT_FOUND.message
                )
            }
            res.status(200).json(product)
        } catch (error) {
            next(error)   
        }
    }

    static async createProduct(req, res){
        try {
            const productData = new ProductDTO(req.body)

            const newProduct = await ProductRepository.addProduct(productData)
            res.status(200).json(newProduct)
        } catch (error) {
            res.status(500).json({error: `Error al crear el producto: ${error.message}`})   
        }
    }

    static async updateProduct(req, res){
        const {pid} = req.params
        const updatedFields = req.body

        try {
            const updatedProduct = await ProductRepository.updateProduct(pid, updatedFields)
            res.status(200).json(updatedProduct)
        } catch (error) {
            res.status(500).json({error: `Error al actualizar el producto: ${error.message}`})   
        }
    }

    static async deleteProduct(req, res){
        const {pid} = req.params

        try {
            await ProductRepository.deleteProducts(pid)
            res.status(200).json({message: 'Producto eliminado con éxito'})
        } catch (error) {
            res.status(500).json({error: `Error al eliminar el producto: ${error.message}`})   
        }
    }

    static async mockProducts(req, res){
        const mockProduct = generateMockProducts(100)
        res.status(200).json(mockProduct)
    }

    static async loggerTest(req, res){
        try{
            logger.debug('Debug message')
            logger.info('Info message')
            logger.warning('Warning message')
            logger.error('Errer message')
            logger.fatal('Fatal message')
            logger.http('HTTP message')

            res.status(200).json({message: 'Mensajes de registro enviados con éxito'})
        } catch(error){
            logger.error(`Error in loggerTest: ${error}`)
            res.status(500).json({error: 'Error al generar los registros'})
        }
    }
}

module.exports = ProductController
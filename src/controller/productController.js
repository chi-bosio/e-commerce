const productModel = require('../dao/models/productModel')
const userModel = require('../dao/models/userModel')
const ProductRepository = require('../services/repository/productRepository')
const routes = require('../utils/utils')
const sendEmail = require('../config/sendEmail')

const routeProducts =  routes.products

class ProductController{    
    static async getAllProducts(req, res){
        const {page = 1, limit = 10, query, sort} = req.query
            
        let filter = {}
        if(query && query !== ''){
            filter = {category: query}
        }

        switch(sort){
            case 'asc':
                sort = {'price': 1}
                break
            case 'desc':
                sort = {'price': -1}
                break
            default:
                sort = undefined
                break
        }

        try {
            let{
                docs: products,
                tPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage
            } = await productModel.paginate(filter, {limit: limit, page: page, sort: sort, lean: true})

            res.status(200).json({
                status: "success",
                payload: products,
                tPages: tPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: page,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: page > 1 ? `/?page=${page - 1}` : null,
                nextLink: page < tPages ? `/?page=${page + 1}` : null
            })
        } catch (error) {
            req.logger.error(error)
            res.status(500).send('Error interno')   
        }
    }

    static async getProductById(req, res){
        const {pid} = req.params
        try {
            const product = await ProductRepository.getProductById(pid)
            res.json({product})
        } catch (error) {
            req.logger.error(error)
            res.status(404).json({error: error.message})  
        }
    }

    static async addProduct(req, res){
        try {
            const productData = req.body
            const email = req?.user?.email || productData.email
            let user = await userModel.findOne({email: email})
            let owner = user.email

            if(user.role === 'premium'){
                productData.owner = owner
            }

            await ProductRepository.addProduct(productData)
            res.status(201).json({message: 'Producto creado'})
        } catch (error) {
            req.logger.error(error)
            res.status(400).json({error: error.message}) 
        }
    }

    static async updateProduct(req, res){
        const {pid} = req.params
        const updatedFields = req.body

        try {
            await ProductRepository.updateProduct(pid, updatedFields)
            res.json({message: 'Producto actualizado con éxito'})
        } catch (error) {
            req.logger.error(error)
            res.status(500).json({error: error.message})   
        }
    }

    static async deleteProduct(req, res){
        const {pid} = req.params

        try {
            const product = await ProductRepository.getProductById(pid)
            if(!product){
                return res.status(404).json({error: 'No se encontró al propietario del producto'})
            }

            if(owner.role === 'premium'){
                const subject = 'Producto eliminado'
                const msg = `
                <p>Estimado ${owner.first__name},</p>
                <p>Le informamos que su producto <strong>${product.title}</strong> ha sido eliminado de nuestra plataforma.</p>
                <p>Saludos,</p>
                <p>El equipo de E-commerce</p>
                `
                await sendEmail(owner.email, subject, msg)
            }

            await ProductRepository.deleteProduct(pid)
            res.json({message: 'Producto eliminado con éxito'})
        } catch (error) {
            req.logger.error(error)
            res.status(500).json({error: error.message})   
        }
    }
}

module.exports = ProductController
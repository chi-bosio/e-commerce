const productModel = require('../dao/models/productModel')
const userModel = require('../dao/models/userModel')
const ProductRepository = require('../services/repository/productRepository')
const sendEmail = require('../config/sendEmail')

const productRepository = new ProductRepository()

class ProductController{    
    static async getProducts(req, res){
        let {page = 1, limit = 10, query, sort} = req.query

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
                page: currentPage,
                hasPrevPage,
                hasNextPage
            } = await productModel.paginate(filter, {limit: limit, page: page, sort: sort, lean: true})

            res.status(200).json({
                status: "success",
                payload: products,
                tPages: tPages,
                prevPage: prevPage,
                nextPage: nextPage,
                page: currentPage,
                hasPrevPage: hasPrevPage,
                hasNextPage: hasNextPage,
                prevLink: page > 1 ? `/?page=${page - 1}` : null,
                nextLink: page < tPages ? `/?page=${page + 1}` : null
            })
        } catch (error) {
            req.logger.error(`Error al obtener los productos 1: ${error.message}`)
            res.status(500).send('Error interno')   
        }
    }

    static async getProductById(req, res){
        const {pid} = req.params
        try {
            const product = await productRepository.getProductById(pid)
            res.json({product})
        } catch (error) {
            req.logger.error(`Error al obtener el producto con ID ${pid}: ${error.message}`)
            res.status(404).json({error: error.message})  
        }
    }

    static async addProduct(req, res){
        try {
            const productData = req.body

            const email = req?.user?.email || productData.email

            let user = await userModel.findOne({email: email})

            let owner = user._id

            if(user.role === 'premium' || user.role === 'admin'){
                productData.owner = owner
            }

            const existingCode = await productModel.findOne({code: productData.code})
            if(existingCode){
                throw new Error('Code existente')
            }

            await productRepository.addProduct(productData)

            res.status(201).json({message: `Producto creado con éxito`})
        } catch (error) {
            if (error.message === "Code existente") {
                res.status(400).json({ error: 'El código del producto ya existe' });
            } else {
                req.logger.error(`Error al crear el producto: ${error.message}`)
                res.status(400).json({error: error.message}) 
            }
        }
    }

    static async updateProduct(req, res){
        const {pid} = req.params
        const updatedFields = req.body

        try {
            await productRepository.updateProduct(pid, updatedFields)
            res.json({message: 'Producto actualizado con éxito'})
        } catch (error) {
            req.logger.error(`Error al actualizar el producto con ID ${pid}: ${error.message}`)
            res.status(500).json({error: error.message})   
        }
    }

    static async deleteProduct(req, res){
        const {pid} = req.params

        try {
            const product = await productRepository.getProductById(pid)
            if(!product){
                return res.status(404).json({error: 'Producto no encontrado'})
            }

            const owner = await userModel.findById(product.owner)
            if(!owner){
                return res.status(404).json({ error: 'Propietario del producto no encontrado' })
            }

            if(owner.role === 'premium' || owner.role === 'admin'){
                const subject = 'Producto eliminado'
                const msg = `
                <p>Estimado ${owner.surname},</p>
                <p>Le informamos que su producto <strong>${product.title}</strong> ha sido eliminado de nuestra plataforma.</p>
                <p>Saludos,</p>
                <p>El equipo de E-commerce</p>
                `
                await sendEmail(owner.email, subject, msg)
            }

            await productRepository.deleteProduct(pid)
            res.json({message: 'Producto eliminado con éxito'})
        } catch (error) {
            req.logger.error(`Error al eliminar el producto con ID ${pid}: ${error.message}`)
            res.status(500).json({error: error.message})   
        }
    }
}

module.exports = ProductController
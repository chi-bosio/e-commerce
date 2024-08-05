const userModel = require('./models/userModel')
const {sendEmail} = require('../config/sendEmail')

class UserDao{
    async getById(filter){
        return await userModel.findOne(filter).lean()
    }

    async create(user){
        return await userModel.create(user)
    }

    async updateLastConnection(uid){
        try {
            const user = await userModel.findById(uid)
            if(!user){
                return {sucess: false, message: 'No se encontró el usuario'}
            }

            user.last_connection = new Date()
            await user.save()

            return {sucess: true, message: 'Última conexión actualizada'}
        } catch (error) {
            return {sucess: false, message: 'Error al actualizar la última conexión'}
        }
    }

    async updateDocuments(uid, documents){
        try {
            const user = await userModel.findById(uid)
            if(!user){
                return {sucess: false, message: 'Usuario no encontrado'}
            }

            const namedDocuments = Object.values(documents).map(document => ({
                name: `${document[0].originalname.split('.')[0]}_${user.email}`,
                reference: document[0].path
            }))

            user.documents.push(...namedDocuments)
            await user.save()
            return {sucess: true, message: 'Documentos actualizados con éxito'}
        } catch (error) {
            return {sucess: false, message: 'Error al actualizar los documentos'}
        }
    }
}

module.exports = UserDao
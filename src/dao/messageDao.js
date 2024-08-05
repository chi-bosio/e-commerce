const messageModel = require('./models/messageModel')

class MessageDAO{
    async getMessages(){
        try {
            return await messageModel.find().lean()
        } catch (error) {
            return error
        }
    }

    async createMessage(msg){
        if(msg.user.trim() === '' || msg.message.trim() === ''){
            return null
        }

        try {
            return await messageModel.create(msg)
        } catch (error) {
            return error
        }
    }

    async deleteAllMessages(){
        try {
            req.logger.info('Eliminando todos los mensajes...')

            const result = await messageModel.deleteMany({})
            req.logger.info('Mensajes eliminados', result)

            return result
        } catch (error) {
            return error
        }
    }
}

module.exports = MessageDAO
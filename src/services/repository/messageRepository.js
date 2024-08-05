const MessageDao = require('../../dao/messageDao')

class MessageRepository{
    constructor(){
        this.messageDAO = new MessageDao()
    }

    async getMessages(){
        return await this.messageDAO.getMessages()
    }

    async createMessage(msg){
        return await this.messageDAO.createMessage(msg)
    }

    async removeAllMessages(){
        return await this.messageDAO.removeAllMessages()
    }
}

module.exports = MessageRepository
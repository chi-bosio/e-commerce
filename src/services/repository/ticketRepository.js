const TicketDAO = require('../../dao/ticketDao')

class TicketRepository{
    constructor(){
        this.ticketDAO = new TicketDAO()
    }

    async getTicketsByUser(uid){
        return await this.ticketDAO.getTicketsByUser(uid)
    }

    async createTicket(uid, cid){
        return await this.ticketDAO.createTicket(uid, cid)
    }

    async checkStock(products){
        return await this.ticketDAO.checkStock(products);
    }
    
    async updateStock(products){
        return await this.ticketDAO.updateStock(products);
    }

    async getLatestTicketByUser(uid){
        return await this.ticketDAO.getLatestTicketByUser(uid);
    }
}

module.exports = TicketRepository
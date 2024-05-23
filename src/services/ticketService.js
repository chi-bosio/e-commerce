const TicketManager = require('../dao/managers/ticketManager')
const TicketDTO = require('../dto/ticketDTO')

class TicketService{
    constructor(){
        this.ticketDAO = new TicketManager()
    }

    async getAllTickets(){
        return await this.ticketDAO.getAllTickets()
    }

    async createTicket(data){
        const ticket = await this.ticketDAO.createTicket(data)
        return new TicketDTO(ticket)
    }
}

module.exports = new TicketService()
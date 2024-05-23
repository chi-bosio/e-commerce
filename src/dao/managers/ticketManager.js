const ticketModel = require('../models/ticketModel')

class TicketManager {
    async getAllTickets(){
        try{
            const tickets = await ticketModel.find()
            return tickets
        } catch(error){
            throw new Error('Error al obtener todos los tickets desde MongoDB: ' + error.message)
        }
    }

    async createTicket(data){
        try{
            const ticket = await ticketModel.create(data)
            await ticket.save()
            return ticket
        } catch(error){
            throw new Error('Error al agregar el ticket a MongoDB: ' + error.message)
        }
    }
}

module.exports = TicketManager
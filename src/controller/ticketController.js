const TicketService = require('../services/ticketService')

class TicketController{
    static async getAllickets(req, res){
        try {
            const tickets = await TicketService.getAllTickets()
            res.status(200).json(tickets)
        } catch (error) {
            res.status(500).json({error: `Error al obtener los tickets: ${error.message}`})
        }
    }

    static async createTicket(req, res){
        const ticketData = req.body
        try {
            const newTicket = await TicketService.createTicket(ticketData)
            res.status(200).json(newTicket)
        } catch (error) {
            res.status(500).json({error: `Error al crear el ticket: $${error.message}`})
        }
    }
}

module.exports = TicketController
const TicketRepository = require('../services/repository/ticketRepository')
const sendEmail = require('../config/sendEmail')

class TicketController{
    static async purchase(req, res){
        const {uid} = req.user
        const cid = req.session.user.cart.toString()

        try {
            const ticket = await TicketRepository.createTicket(uid, cid)
            req.logger.info('Ticket creado con éxito')

            const userEmail = req.user.email
            const latestTicket = await TicketRepository.getLatestTicketByUser(uid)
            await sendEmail(
                userEmail, 
                `Su compra ha sido completada. ID del ticket: ${latestTicket.code}`,
                    `<h1>Gracias por realizar su compra</h1>
                <p>Por favor no pierda su ID de compra para realizar reclamos:</p> 
                <h2>${latestTicket.code}</h2>
                <p>Precio: ${latestTicket.amount}</p>
                `
            )
            res.status(201).json(ticket)
        } catch (error) {
            req.logger.error('Error al crear el ticket')
            res.statut(500).json({error: 'Error interno'})
        }
    }
}

module.exports = TicketController
const TicketRepository = require('../services/repository/ticketRepository')
const ticketRepository = new TicketRepository()
const sendEmail = require('../config/sendEmail')

class TicketController {
    static async purchase(req, res) {
        try {

            if (!req.user) {
                req.logger.error('Usuario no autenticado')
                return res.status(401).json({ error: 'Usuario no autenticado' })
            }

            const uid = req.user._id

            const cid = req.session.user?.cart?.toString()

            if (!cid) {
                req.logger.error('No se encontró un carrito asociado al usuario')
                return res.status(400).json({ error: 'No se encontró un carrito asociado al usuario' })
            }

            const ticket = await ticketRepository.createTicket(uid, cid)
            req.logger.info('Ticket creado con éxito')

            const userEmail = req.user.email

            const latestTicket = await ticketRepository.getLatestTicketByUser(uid)

            await sendEmail(
                userEmail,
                `Su compra ha sido completada. ID del ticket: ${latestTicket.code}`,
                `<h1>Gracias por realizar su compra</h1>
                <p>Por favor no pierda su ID de compra para realizar reclamos:</p> 
                <h2>${latestTicket.code}</h2>
                <p>Precio: ${latestTicket.amount}</p>`
            )

            res.status(201).json(ticket)
        } catch (error) {
            req.logger.error(`Error al crear el ticket: ${error.message}`)
            res.status(500).json({ error: 'Error interno' })
        }
    }
}

module.exports = TicketController
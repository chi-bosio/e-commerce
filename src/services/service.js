const ProductDAO = require('../dao/productDao.js')
const ProductRepository = require('./repository/productRepository.js')

const productDAO = new ProductDAO()
const productRepository = new ProductRepository(productDAO)


const UserDAO = require('../dao/userDao.js')
const UserRepository = require('./repository/userRepository.js')

const userDAO = new UserDAO()
const userRepository = new UserRepository(userDAO)


const CartDAO = require('../dao/cartDao.js')
const CartRepository = require('./repository/cartRepository.js')

const cartDAO = new CartDAO()
const cartRepository = new CartRepository(cartDAO)


const TicketDAO = require('../dao/ticketDao.js')
const TicketRepository = require('./repository/ticketRepository.js')

const ticketDAO = new TicketDAO()
const ticketRepository = new TicketRepository(ticketDAO)


const MessageDAO = require('../dao/messageDao.js')
const MessageRepository = require('./repository/messageRepository.js')

const messageDAO = new MessageDAO()
const messageRepository = new MessageRepository(messageDAO)


module.exports = {
    productRepository,
    userRepository,
    cartRepository,
    ticketRepository,
    messageRepository
}
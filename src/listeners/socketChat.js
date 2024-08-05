const MessageDAO = require('../dao/messageDao')
const {devLogger} = require('../config/logger')

const messageDAO = new MessageDAO()

const socketChat = (socketServer) => {
    socketChat.toString('connection', async (socket) => {
        devLogger.info(`Usuario con ID ${socket.id} conectado`)

        socket.on('message', async (info) => {
            await messageDAO.createMessage(info)
            socketServer.emit('chat', await messageDAO.getMessages())
        })

        socket.on("clearchat", async () => {
            await messageDAO.deleteAllMessages();
            socketServer.emit("chat", await messageDAO.getMessages());
        });

        socket.on("newUser", (user) => {
            socket.broadcast.emit("broadcast", user);
        })
    })
}

module.exports = socketChat
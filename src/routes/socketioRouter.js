const express = require('express')
const {Server} = require('socket.io')

const socketIORouter = (io) => {
    const Router = require('express').Router;
    const router = Router();

    io.on('connection', (socket) => {
        socket.on('addProduct', (productName) => {
            io.emit('productAdded', productName)
        })

        socket.on('deleteProduct', (productId) => {

            io.emit('productDeleted', productId);
        });
    })

    return router
}

module.exports = socketIORouter;
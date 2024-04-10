const io = require('/socket.io/socket.io.js')

const socket = io();

socket.on('productAdded', (product) => {
    const productList = document.getElementById('productList');
    const listItem = document.createElement('li');
    listItem.textContent = product;
    productList.appendChild(listItem);
});

module.exports = socket
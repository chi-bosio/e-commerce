const express=require('express');
const http = require('http')
const {Server}= require("socket.io")
const engine = require('express-handlebars').engine
const path = require('path')

const productRouter = require('./routes/productRouter.js')
const cartRouter = require('./routes/cartRouter.js')
const handlebarsRouter = require('./routes/handlebarsRouter.js')
const socketioRouter = require('./routes/socketioRouter.js')

const PORT = 8080
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', handlebarsRouter)
app.use('/socketio', socketioRouter)

app.get('/', (req, res) => {
    res.send('Bienvenido a mi localhost...!!!')
})

app.get('*', (req, res) => {
    res.send('Error 404 - Not Found')
})

server.listen(PORT, () => {
    console.log(`Server Online en puerto ${PORT}`);
});
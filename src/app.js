const express=require('express');
const http = require('http')
const {Server}= require('socket.io')
const engine = require('express-handlebars').engine
const path = require('path')
const mongoose = require('mongoose')
const messageModel = require("./dao/models/messagesModel.js")

const productRouter = require('./routes/productRouter.js')
const cartRouter = require('./routes/cartRouter.js')
const {router, handleRealTimeProductsSocket} = require('./routes/viewRouter.js')

const viewRouter = router

const PORT = 8080
const app = express()

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/', viewRouter)

app.get('*', (req, res) => {
    res.send('Error 404 - Not Found')
})

const server = app.listen(PORT, () => {
    console.log(`Server Online en puerto ${PORT}`);
});

const io = new Server(server)

handleRealTimeProductsSocket(io)

const connect = async () => {
    try{
        await mongoose.connect("mongodb+srv://chibosio:Mika&Silver@cluster0.3jin0k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce")
        console.log("DB online...!!");
    } catch(error){
        console.log("Conexión fallida. Detalle:", error.message);
    }
} 
connect()
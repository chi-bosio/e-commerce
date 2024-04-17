const express=require('express');
const http = require('http')
const socketIO = require('socket.io')
const engine = require('express-handlebars').engine
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')

const passportConfig = require('./config/passportConfig.js')

const productRouter = require('./routes/productRouter.js')
const cartRouter = require('./routes/cartRouter.js')
const {router, handleRealTimeProductsSocket} = require('./routes/viewRouter.js')
const sessionRouter = require('./routes/sessionsRouter.js')

const viewRouter = router

const PORT = 8080
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

passportConfig()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)

app.get('*', (req, res) => {
    res.send('Error 404 - Not Found')
})

app.listen(PORT, () => {
    console.log(`Server Online en puerto ${PORT}`);
});

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
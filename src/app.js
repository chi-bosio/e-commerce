const express= require('express');
const session = require('express-session')
const socketIO = require('socket.io')
const engine = require('express-handlebars').engine
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

const passportConfig = require('./config/passportConfig.js')
const ProductManager = require('../src/dao/managers/productManager.js')
const pm = new ProductManager

const productRouter = require('./routes/productRouter.js')
const cartRouter = require('./routes/cartRouter.js')
const viewRouter = require('./routes/viewRouter.js')
const sessionRouter = require('./routes/sessionsRouter.js')

const PORT = 8080
const app = express()
app.use(cookieParser(process.env.COOKIE_SECRET))
dotenv.config()

app.use(session({
    secret: 'miSecretKey',
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
// app.use((req, res, next) => {
//     console.log("Contenido de req.session:", req.session);
//     console.log("Valor de req.session.user:", req.session.user);
//     console.log("Valor de req.user:", req.user);
//     console.log(req.signedCookies);
//     // console.log("req.user._id", req.user._id);

//     next();
//   });

app.use(express.json());
app.use(express.urlencoded({extended:true}));

passportConfig()
app.use(passport.initialize())

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

const server = app.listen(PORT, () => {
    console.log(`Server Online en puerto ${PORT}`);
});

const io = socketIO(server)

const connect = async () => {
    try{
        await mongoose.connect(`mongodb+srv://chibosio:${process.env.MONGO_PASSWORD}@cluster0.3jin0k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce`)
        console.log("DB online...!!");
    } catch(error){
        console.log("Conexión fallida. Detalle:", error.message);
    }
} 
connect()

io.on("connection", (socket) => {
    socket.on("newProduct", async (title, description, price, thumbnail, code, stock, category, status) => {
      await pm.addProduct(title, description, price, thumbnail, code, stock, category, status);
      const updatedProducts = await pm.getProduct();
      io.emit("products", updatedProducts);
    });
  
    socket.on("deleteProduct", async (id) => {
      try {
        await pm.deleteProduct(id);
        io.emit("products", await pm.getProduct());
      } catch (error) {
        console.error("Error al eliminar el producto:", error.message);
      }
    });
  
    socket.on("requestInitialProducts", async () => {
      const products = await pm.getProduct();
      socket.emit("initialProducts", products);
    });
});

module.exports = io
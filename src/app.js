const express= require('express');
const session = require('express-session')
const socketIO = require('socket.io')
const engine = require('express-handlebars').engine
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const http = require('http')
const connectMongo = require('connect-mongo')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const errorHandler = require('./middlewares/errorHandler.js')
const logger = require('./utils/logger.js')

const productRouter = require('./routes/productRouter.js')
const cartRouter = require('./routes/cartRouter.js')
const {router, handleRealTimeProductsSocket} = require('./routes/viewRouter.js')
const sessionRouter = require('./routes/sessionRouter.js')

const passportConfig = require('./config/passportConfig.js')
const config = require('./config/config.js')
const viewRouter = router

const PORT = 8080
const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "e-commerce",
      version: "1.0.0",
      description: "Documentación del e-commerce "
    },
    apis: ["./docs/*.js"]
  }
}
const spec = swaggerJsdoc(options)

app.use((req, res, next) => {
  logger.http(`${req.method} - ${req.url}`)
  next()
})

app.use(errorHandler)

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session(
  {
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
    store: connectMongo.create({mongoUrl: `mongodb+srv://chibosio:Mika&Silver@cluster0.3jin0k1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&dbName=ecommerce`})
  }
))

app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(spec))

passportConfig()
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', engine({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'))

app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)

handleRealTimeProductsSocket(io)

app.use((req, res) => {
  res.status(404).json({error: 'Error 404 - Not Found'})
})

server.listen(PORT, () => {
  logger.info(`Server Online en puerto ${PORT}`);
})

const connect = async () => {
  try{
      await mongoose.connect(config.MONGO_URL, {
        dbName: config.DB_NAME
      })
      logger.info("DB online...!!");
  } catch(error){
      logger.error("Conexión fallida. Detalle:", error.message);
  }
} 

connect()
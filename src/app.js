const express= require('express');
const session = require('express-session')
const {Server} = require('socket.io')
const engine = require('express-handlebars').engine
const path = require('path')
const mongoose = require('mongoose')
const passport = require('passport')
const connectMongo = require('connect-mongo')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const productRouter = require('./routes/productRouter.js')
const cartRouter = require('./routes/cartRouter.js')
const viewRouter = require('./routes/viewRouter.js')
const sessionRouter = require('./routes/sessionRouter.js')
const userRouter = require('./routes/userRouter.js')
const loggerRouter = require('./routes/loggerRouter.js')

const logger = require('./config/logger.js')
const passportConfig = require('./config/passportConfig.js')
const config = require('./config/config.js')
const connToDB = require('./config/configServer.js')
const socketProducts = require('./listeners/socketProducts.js')
const socketChat = require('./listeners/socketChat.js')

const PORT = config.PORT
const app = express()

app.use((req, res, next) => {
  req.logger = logger
  next()
})
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connToDB()

app.use(session(
  {
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true,
    store: connectMongo.create({
      mongoUrl: config.MONGO_URL,
      ttl: 3000
    })
  }
))

passportConfig()
app.use(passport.initialize());
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', viewRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/users', userRouter)
app.use('/loggerTest', loggerRouter)

const options = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "e-commerce",
      description: "Documentación del e-commerce "
    }
  },
  apis: ["./src/docs/*.yaml"]
}
const spec = swaggerJsdoc(options)
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(spec))


app.use((req, res) => {
  res.status(404).json({error: 'Error 404 - Not Found'})
})

const http = app.listen(PORT, () => {
  logger.info(`Server Online en puerto ${PORT}`);
})

const io = new Server(http)

socketProducts(io)
socketChat(io)
const {loggers} = require('../controller/loggersController')
const Router = require('express').Router
const router = Router()

router.get('/', loggers)


module.exports = router
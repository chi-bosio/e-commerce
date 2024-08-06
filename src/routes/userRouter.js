const UserController = require('../controller/userController')
const {upload} = require('../utils/utils')
const Router = require('express').Router
const router = Router()

router.get('/', UserController.getAllUsers)


router.post('/:uid/documents', upload, UserController.uploadsDocuments)

router.post('/role/:uid', UserController.updateUserRole)

router.post('/:uid', UserController.deleteUser)


router.put('/premium/::uid', UserController.updatePremiumStatus)


router.delete('/:uid', UserController.deleteInactiveUsers)


module.exports = router
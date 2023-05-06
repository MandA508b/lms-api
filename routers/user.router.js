const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/refresh', userController.refresh)
router.get('/findAll', userController.findAll)
router.post('/findById', userController.findById)
router.post('/logout', userController.logout)

module.exports = router
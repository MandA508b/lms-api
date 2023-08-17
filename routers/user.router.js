const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/refresh', userController.refresh)
router.get('/findAll', userController.findAll)
router.get('/findById', userController.findById)
router.get('/activate/:link', userController.activate)
router.get('/countUserWallet', userController.countUserWallet)
router.post('/logout', userController.logout)

module.exports = router
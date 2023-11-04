const Router = require('express')
const router = new Router()
const userController = require('../controllers/user.controller')
const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.post('/refresh', userController.refresh)
router.get('/findAll', admin_middleware, auth_middleware, userController.findAll)
router.get('/findById', userController.findById)
router.get('/activate/:link', userController.activate)
    router.get('/findAllByPayouts', userController.findAllByPayouts)
router.get('/countUserWallet', auth_middleware, userController.countUserWallet)
router.post('/logout', userController.logout)

module.exports = router
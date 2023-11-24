const Router = require('express')
const router = new Router()
const transactionController = require('../controllers/transaction.controller')
const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')

router.post('/declinedWithdrawRequests', admin_middleware, auth_middleware, transactionController.declinedWithdrawRequests)
router.post('/acceptWithdrawRequests', admin_middleware, auth_middleware, transactionController.acceptWithdrawRequests)
router.post('/createWithdrawRequest', auth_middleware, transactionController.createWithdrawRequest)
router.get('/findWithdrawRequests', transactionController.findWithdrawRequests)

module.exports = router
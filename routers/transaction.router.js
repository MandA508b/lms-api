const Router = require('express')
const router = new Router()
const transactionController = require('../controllers/transaction.controller')

router.post('/create', transactionController.create)
router.post('/callbackWayforpay', transactionController.callbackWayforpay)

module.exports = router
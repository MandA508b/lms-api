const Router = require('express')
const router = new Router()
const transactionController = require('../controllers/transaction.controller')

router.post('/create', transactionController.create)

module.exports = router
const Router = require('express')
const router = new Router()
const userWalletController = require('../controllers/user_wallet.controller')

router.get('/findByUserId', userWalletController.findByUserId)

module.exports = router
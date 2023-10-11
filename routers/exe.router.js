const Router = require('express')
const router = new Router()
const exeController = require('../controllers/exe.controller')

router.get('/getPrice', exeController.getPrice)
router.post('/swap', exeController.swap)

module.exports = router
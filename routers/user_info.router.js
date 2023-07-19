const Router = require('express')
const router = new Router()
const userInfoController = require('../controllers/user_info.controller')

router.post('/create', userInfoController.create)
router.put('/update', userInfoController.update)

module.exports = router
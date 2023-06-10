const Router = require('express')
const router = new Router()
const userAnswerController = require('../controllers/user_answer.controller')

router.post('/create', userAnswerController.create)

module.exports = router
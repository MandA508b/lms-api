const Router = require('express')
const router = new Router()
const userAnswerController = require('../controllers/user_answer.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')

router.post('/create', student_middleware, auth_middleware, userAnswerController.create)

module.exports = router
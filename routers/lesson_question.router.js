const Router = require('express')
const router = new Router()
const lessonQuestionController = require('../controllers/lesson_question.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/create', author_middleware, auth_middleware, lessonQuestionController.create)
router.put('/updateName', author_middleware, auth_middleware, lessonQuestionController.updateName)
router.get('/findAllByLesson', auth_middleware, lessonQuestionController.findAllByLesson)
router.get('/findById', auth_middleware, lessonQuestionController.findById)
router.delete('/delete', author_middleware, auth_middleware, lessonQuestionController.delete)

module.exports = router
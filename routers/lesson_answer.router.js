const Router = require('express')
const router = new Router()
const lessonAnswerController = require('../controllers/lesson_answer.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/create', author_middleware, auth_middleware, lessonAnswerController.create)
router.put('/updateLessonAnswer', author_middleware, auth_middleware, lessonAnswerController.updateLessonAnswer)
router.get('/findAllByQuestion', auth_middleware, lessonAnswerController.findAllByQuestion)
router.get('/findById', auth_middleware, lessonAnswerController.findById)
router.delete('/delete', author_middleware, auth_middleware, lessonAnswerController.delete)

module.exports = router
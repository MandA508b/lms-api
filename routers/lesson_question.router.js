const Router = require('express')
const router = new Router()
const lessonQuestionController = require('../controllers/lesson_question.controller')

router.post('/create', lessonQuestionController.create)
router.get('/findAllByLesson', lessonQuestionController.findAllByLesson)
router.get('/findById', lessonQuestionController.findById)
router.delete('/delete', lessonQuestionController.delete)

module.exports = router
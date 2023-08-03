const Router = require('express')
const router = new Router()
const lessonAnswerController = require('../controllers/lesson_answer.controller')

router.post('/create', lessonAnswerController.create)
router.put('/updateLessonAnswer', lessonAnswerController.updateLessonAnswer)
router.get('/findAllByQuestion', lessonAnswerController.findAllByQuestion)
router.get('/findById', lessonAnswerController.findById)
router.delete('/delete', lessonAnswerController.delete)

module.exports = router
const Router = require('express')
const router = new Router()
const userRouter = require('./user.router')
const courseRouter = require('./course.router')
const lessonRouter = require('./lesson.router')
const lessonAnswerRouter = require('./lesson_answer.router')
const lessonQuestionRouter = require('./lesson_question.router')

router.use('/user', userRouter)
router.use('/course', courseRouter)
router.use('/lesson', lessonRouter)
router.use('/lessonAnswer', lessonAnswerRouter)
router.use('/lessonQuestion', lessonQuestionRouter)

module.exports = router

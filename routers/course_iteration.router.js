const Router = require('express')
const router = new Router()
const courseIterationController = require('../controllers/course_iteration.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/create', courseIterationController.create)
router.get('/findById', courseIterationController.findById)
router.get('/findByUser', auth_middleware, courseIterationController.findByUser)
router.get('/actualIteration', courseIterationController.actualIteration)

module.exports = router
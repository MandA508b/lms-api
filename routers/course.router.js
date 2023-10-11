const Router = require('express')
const router = new Router()
const courseController = require('../controllers/course.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')

router.post('/create', author_middleware, auth_middleware, courseController.create)
router.post('/publishCourse', author_middleware, auth_middleware, courseController.publishCourse)
router.put('/updateName',  auth_middleware, courseController.updateName)
router.put('/updateDescription', author_middleware, auth_middleware, courseController.updateDescription)
router.get('/findAll', courseController.findAll)
router.get('/findByAuthor', auth_middleware, courseController.findByAuthor)
router.get('/findById', courseController.findById)
router.get('/findUserCourses', student_middleware, auth_middleware, courseController.findUserCourses)
router.delete('/delete', author_middleware, auth_middleware, courseController.delete)

module.exports = router

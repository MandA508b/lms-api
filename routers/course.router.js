const Router = require('express')
const router = new Router()
const courseController = require('../controllers/course.controller')
const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')
<<<<<<< HEAD
const multer = require("multer");

const upload = multer()

router.post('/create', author_middleware, auth_middleware, upload.single('image'), courseController.create)//todo: test
=======

router.post('/create', author_middleware, auth_middleware, courseController.create)
>>>>>>> 6910e5bfc81f0013a9d3d6848479de1dbe129f90
router.post('/publishCourse', author_middleware, auth_middleware, courseController.publishCourse)
router.post('/updateDuration', admin_middleware, auth_middleware, courseController.updateDuration)
router.put('/updateName',  auth_middleware, courseController.updateName)
router.put('/updateDescription', author_middleware, auth_middleware, courseController.updateDescription)
router.get('/findAll', courseController.findAll)
router.get('/findByAuthor', auth_middleware, courseController.findByAuthor)
router.get('/findById', courseController.findById)
router.get('/coursesStatistics', courseController.coursesStatistics)
router.get('/findUserCourses', student_middleware, auth_middleware, courseController.findUserCourses)
<<<<<<< HEAD
router.delete('/delete', author_middleware, auth_middleware, courseController.delete)//todo: delete image
// todo: add update image
=======
router.delete('/delete', author_middleware, auth_middleware, courseController.delete)
>>>>>>> 6910e5bfc81f0013a9d3d6848479de1dbe129f90

module.exports = router

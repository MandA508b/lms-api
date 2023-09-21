const Router = require('express')
const router = new Router()
const lessonController = require('../controllers/lesson.controller')
const multer  = require('multer')
const path = require('path')
let crypto = require('crypto')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')

const storage = multer.diskStorage({
    destination: path.join(__dirname, `../src/videos`),
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(30).toString('hex') + '.mp4')
    }
})

const upload = multer({ storage: storage })

router.post('/create', author_middleware, auth_middleware, upload.single('video'), lessonController.create)
router.post('/createFullLesson', author_middleware, auth_middleware, lessonController.createFullLesson)//todo: , upload.single('video')
router.put('/updateNumberLesson', author_middleware, auth_middleware, lessonController.updateNumberLesson)
router.put('/updateName', author_middleware, auth_middleware, lessonController.updateName)
router.get('/findAll', author_middleware, auth_middleware, lessonController.findAllByCourse)
router.get('/findById', auth_middleware, lessonController.findById)
router.get('/findActualLesson', student_middleware, auth_middleware, lessonController.findActualLesson)
router.delete('/delete', author_middleware, auth_middleware, lessonController.delete)

module.exports = router

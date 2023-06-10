const Router = require('express')
const router = new Router()
const lessonController = require('../controllers/lesson.controller')
const multer  = require('multer')
const path = require('path')
let crypto = require('crypto')

const storage = multer.diskStorage({
    destination: path.join(__dirname, `../src/videos`),
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(30).toString('hex') + '.mp4')
    }
})

const upload = multer({ storage: storage })

router.post('/create', upload.single('video'), lessonController.create)
router.post('/createFullLesson', upload.single('video'), lessonController.createFullLesson)
router.get('/findAll', lessonController.findAllByCourse)
router.get('/findById', lessonController.findById)
router.get('/findActualLesson', lessonController.findActualLesson)
router.delete('/delete', lessonController.delete)

module.exports = router

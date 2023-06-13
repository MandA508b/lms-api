const Router = require('express')
const router = new Router()
const courseController = require('../controllers/course.controller')

router.post('/create', courseController.create)
router.post('/publishCourse', courseController.publishCourse)
router.get('/findAll', courseController.findAll)
router.get('/findByAuthor', courseController.findByAuthor)
router.get('/findById', courseController.findById)
router.delete('/delete', courseController.delete)

module.exports = router

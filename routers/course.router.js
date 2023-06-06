const Router = require('express')
const router = new Router()
const courseController = require('../controllers/course.controller')

router.post('/create', courseController.create)
router.get('/findAll', courseController.findAll)
router.get('/findById', courseController.findById)
router.delete('/delete', courseController.delete)

module.exports = router
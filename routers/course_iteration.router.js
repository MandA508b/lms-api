const Router = require('express')
const router = new Router()
const courseIterationController = require('../controllers/course_iteration.controller')

router.post('/create', courseIterationController.create)
router.get('/findById', courseIterationController.findById)
router.get('/findByUser', courseIterationController.findByUser)
router.get('/actualIteration', courseIterationController.actualIteration)

module.exports = router
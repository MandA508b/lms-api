const Router = require('express')
const router = new Router()
const courseRegistrationController = require('../controllers/сourse_registration.controller')

router.post('/create', courseRegistrationController.create)
router.get('/findById', courseRegistrationController.findById)
router.get('/findByUser', courseRegistrationController.findByUser)

module.exports = router
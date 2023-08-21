const Router = require('express')
const router = new Router()
const courseRegistrationController = require('../controllers/сourse_registration.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')

router.post('/create', student_middleware, auth_middleware, courseRegistrationController.create)
router.get('/findById', auth_middleware, courseRegistrationController.findById)
router.get('/findByUser', student_middleware, auth_middleware, courseRegistrationController.findByUser)

module.exports = router
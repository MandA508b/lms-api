const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/rating.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
const student_middleware = require('../middlewares/student.middleware')

router.post('/createLessonRating', student_middleware, auth_middleware, ratingController.createLessonRating)

module.exports = router
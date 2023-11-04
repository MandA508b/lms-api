const Router = require('express')
const router = new Router()
const courseThemeController = require('../controllers/course_theme.controller')
const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/create', admin_middleware, auth_middleware, courseThemeController.create)
router.get('/findAll', author_middleware, auth_middleware, courseThemeController.findAll)
router.delete('/delete', admin_middleware, auth_middleware, courseThemeController.delete)


module.exports = router
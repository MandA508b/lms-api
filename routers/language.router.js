const Router = require('express')
const router = new Router()
const languageController = require('../controllers/language.controller')
const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/create', admin_middleware, auth_middleware, languageController.create)
router.get('/findAll', auth_middleware, languageController.findAll)
router.get('/findById', auth_middleware, languageController.findById)

module.exports = router
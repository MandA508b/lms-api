const Router = require('express')
const router = new Router()
const userInfoController = require('../controllers/user_info.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')

router.post('/create', auth_middleware, userInfoController.create)
router.put('/update', auth_middleware, userInfoController.update)

module.exports = router
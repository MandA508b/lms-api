const Router = require('express')
const router = new Router()
const userInfoController = require('../controllers/user_info.controller')
// const admin_middleware = require('../middlewares/admin.middleware')
const auth_middleware = require('../middlewares/auth.middleware')
// const author_middleware = require('../middlewares/author.middleware')
// const student_middleware = require('../middlewares/student.middleware')
const multer = require("multer");
const upload = multer()

router.post('/create', upload.single('avatar'), userInfoController.create)
router.put('/update', auth_middleware, upload.single('avatar'), userInfoController.update)


module.exports = router
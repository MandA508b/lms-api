const Router = require('express')
const router = new Router()
const languageController = require('../controllers/language.controller')

router.post('/create', languageController.create)
router.get('/findAll', languageController.findAll)
router.get('/findById', languageController.findById)

module.exports = router
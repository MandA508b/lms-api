const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/rating.controller')

router.post('/createLessonRating', ratingController.createLessonRating)

module.exports = router
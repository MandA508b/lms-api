const ApiError = require(`../errors/api.error`)
const ratingService = require('../services/rating.service')

class ratingController{

    async createLessonRating(req,res,next) {
        try {
            const {user_id, lesson_id, rating} = req.body
            if(!user_id || !lesson_id || !rating) {
                return next(ApiError.badRequest())
            }
            const created_rating = await ratingService.createLessonRating(user_id, lesson_id, rating)

            return res.json(created_rating)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new ratingController()
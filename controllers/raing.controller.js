const ApiError = require(`../errors/api.error`)
const ratingService = require('../services/rating.service')

class ratingController{

    async createLessonRating(req,res,next) {
        try {
            const {user_id, item_id, course_id, type, rating} = req.body
            if(!user_id || !item_id || !type || !rating) {
                return next(ApiError.badRequest())
            }
            const created_rating = await ratingService.createLessonRating(user_id, item_id, course_id, type, rating)

            return res.json(created_rating)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new ratingController()
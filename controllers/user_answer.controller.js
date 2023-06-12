const ApiError = require(`../errors/api.error`)
const userAnswerService = require('../services/user_answer.service')

class userAnswerController{
    async create(req,res,next){
        try{
            const {user_id, course_iteration_id, lesson_id, is_correct} = req.body//todo: 123456 + findall

            if(!user_id || !course_iteration_id || !lesson_id ||  is_correct===undefined){
                return next(ApiError.badRequest())
            }
            const user_answer = await userAnswerService.create(user_id, course_iteration_id, lesson_id, is_correct)

            return res.json(user_answer)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new userAnswerController()
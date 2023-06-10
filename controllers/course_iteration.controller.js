const ApiError = require(`../errors/api.error`)
const courseIterationService = require('../services/course_iteration.service')

class courseIterationController{

    async create(req,res,next) {
        try {
            const {course_id} = req.body
            if(!course_id) {
                return next(ApiError.badRequest())
            }
            const course_iteration = await courseIterationService.create(course_id)

            return res.json(course_iteration)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {course_iteration_id} = req.query
            if(course_iteration_id === undefined){
                return next(ApiError.badRequest())
            }
            const course_iteration = await courseIterationService.findById(course_iteration_id)

            return res.json(course_iteration)
        }catch (e) {
            next(e)
        }
    }

    async findByUser(req, res, next){
        try{
            const {user_id} =req.body
            if(!user_id){
                return next(ApiError.badRequest())
            }
            const course_iterations = await courseIterationService.findByUser(user_id)

            return res.json(course_iterations)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new courseIterationController()
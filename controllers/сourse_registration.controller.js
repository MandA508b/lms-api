const ApiError = require(`../errors/api.error`)
const courseRegistrationService = require('../services/course_registration.service')
class courseRegistrationController{

    async create(req,res,next) {
        try {
            const {course_id, user_id} = req.body

            if(!course_id || !user_id) {
                return next(ApiError.badRequest())
            }

            const course_registration = await courseRegistrationService.create(course_id, user_id)

            return res.json(course_registration)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {course_registration_id} = req.query
            if(course_registration_id === undefined){
                return next(ApiError.badRequest())
            }
            const course_registration = await courseRegistrationService.findById(course_registration_id)

            return res.json(course_registration)
        }catch (e) {
            next(e)
        }
    }

    async findByUser(req, res, next){//list of courses for which the user is registered
        try{
            const {user_id} = req.body
            if(!user_id){
                return next(ApiError.badRequest())
            }
            const course_registrations = await courseRegistrationService.findByUser(user_id)

            return res.json(course_registrations)
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async checkSolvency(req ,res, next) {
        try {
            const {user_id, course_id} = req.query

            if (!user_id || !course_id) {
                return next(ApiError.badRequest())
            }
            const data = await courseRegistrationService.checkSolvency(user_id, course_id)

            return res.json(data)
        } catch (e) {
            next(e)
        }
    }

    async callbackWayforpay(req,res,next) {
        try {
            const data = req.body;

            if(!data) {
                return next(ApiError.badRequest())
            }
            await courseRegistrationService.callbackWayforpay(data)

            return res.status(200).send('OK');
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new courseRegistrationController()
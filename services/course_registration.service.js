const Course_registration = require('../models/course_registration.model')
const Course_iteration = require('../models/course_iteration.model')
const User = require('../models/user.model')
const Course = require('../models/course.model')
const timeService = require('./time.service')
const ApiError = require(`../errors/api.error`)

class courseRegistrationService{

    async create(course_id, user_id) {
        try{
            const user = await User.findById(user_id)//checking for the relevance of the user

            if(user === null){
                throw ApiError.notFound('Юзера не знайдено!')
            }//checked!

            let start_at = await timeService.getDate(2);
            start_at = start_at.yyyy + '.' + start_at.mm + '.' + "01";

            const course_iteration = await Course_iteration.findOne({start_at})

            if(course_iteration === null){
                throw ApiError.notFound('Ітерацію не знайдено!')
            }

            const course_registration = await Course_registration.create({course_id, user_id, course_iteration_id: course_iteration._id})
            course_iteration.participants = course_iteration.participants + 1
            await course_iteration.save()

            return course_registration
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(course_registration_id){
        try {
            const course_registration = await Course_registration.findById(course_registration_id)
            if(course_registration === undefined){
                throw ApiError.notFound('Реєстрацію на курс не знайдено!')
            }

            return course_registration
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findByUser(user_id){
        try{
            const course_registrations = await Course_registration.find({user_id})
            let user_course_registrations = []
            for (let key in course_registrations) {
                const course = await Course.findById(course_registrations[key]._id)
                user_course_registrations.push(course)
            }

            return user_course_registrations
        }catch (e) {
            console.log("error ", e)
        }
    }

    async actualRegistration(user_id, course_iteration, course_id){//todo: переробити
        try{
            let date = await timeService.getDate(1);
            date = date.yyyy + '.' + date.mm + '.' + date.dd;
            const course_registration = await Course_registration.findOne({user_id, course_id, course_iteration_id: course_iteration._id})

            if(course_registration!==null && course_iteration.start_at <= date && course_iteration.finish_at > date){
                return course_registration
            }

            return null
        }catch (e) {
            console.log("error ", e)
        }
    }

    async checkRegistration(user_id, course_id){
        try{
            const course_registrations = await Course_registration.find({user_id, course_id})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseRegistrationService()

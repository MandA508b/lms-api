const User_answer = require('../models/user_answer.model')
const Course_iteration = require('../models/course_iteration.model')
const timeService = require('./time.service')
const ApiError = require(`../errors/api.error`)

class userAnswerService{

    async create(user_id, course_iteration_id, lesson_id, question_id, is_correct) {
        try{

            let created_at = await timeService.getDate(1);
            created_at = created_at.yyyy + '.' + created_at.mm + '.' + created_at.dd;

            const course_iteration = await Course_iteration.findById(course_iteration_id)

            if(!course_iteration){
                throw ApiError.notFound()
            }

            const data = await timeService.getDate(1)
            let is_correct = false,
                full_data = data.yyyy + '.' + data.mm + '.' + data.dd

            if(full_data < course_iteration.start_at ||  full_data >= course_iteration.finish_at){
                throw ApiError.notFound()
            }

            const candidate = await User_answer.findOne({user_id, course_iteration_id, lesson_id, question_id})
            if(candidate){
                candidate.is_correct = is_correct
                candidate.attempt = candidate.attempt + 1
                await candidate.save()
                return candidate
            }

            const mistake = await User_answer.findOne({user_id, course_iteration_id, is_correct: false})
            if(mistake !== undefined){
                throw ApiError.notFound()
            }

            return await User_answer.create({user_id, course_iteration_id, lesson_id, question_id, is_correct, created_at})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userAnswerService()

const User_answer = require('../models/user_answer.model')
const Course_iteration = require('../models/course_iteration.model')
const timeService = require('./time.service')
const ApiError = require(`../errors/api.error`)

class userAnswerService{

    async create(user_id, course_iteration_id, lesson_id, is_correct) {
        try{
            const course_iteration = await Course_iteration.findById(course_iteration_id)

            if(!course_iteration){
                throw ApiError.notFound()
            }

            const data = await timeService.getDate(1)
            let full_data = data.yyyy + '.' + data.mm + '.' + data.dd

            if(full_data < course_iteration.start_at ||  full_data >= course_iteration.finish_at){
                throw ApiError.notFound()
            }

            let in_time = false

            const user_answers = await User_answer.find({user_id, course_iteration_id}).sort({created_at: -1})
            if(user_answers.length===0 || (user_answers.length>0 && data.dd-user_answers[0].created_at.slice(user_answers[0].created_at.length-2)===1)){
                in_time = true
            }

            const candidate = await User_answer.findOne({user_id, course_iteration_id, in_time, lesson_id})
            if(candidate){
                candidate.is_correct = is_correct
                candidate.attempt = candidate.attempt + 1
                await candidate.save()
                return candidate
            }

            return await User_answer.create({user_id, course_iteration_id, lesson_id, in_time, is_correct, created_at: full_data})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userAnswerService()

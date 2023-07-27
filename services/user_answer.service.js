const User_answer = require('../models/user_answer.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_iteration_winner = require('../models/course_iteration_winner.model')
const Course = require('../models/course.model')
const ApiError = require(`../errors/api.error`)

class userAnswerService{

    async create(user_id, course_iteration_id, lesson_id, is_correct) {
        try{
            const course_iteration = await Course_iteration.findById(course_iteration_id)

            if(!course_iteration){
                throw ApiError.notFound()
            }
            let in_time = false

            const date = new Date().getTime()

            const candidate = await User_answer.findOne({user_id, course_iteration_id, lesson_id})
            if(candidate){
                candidate.is_correct = is_correct
                candidate.attempt = candidate.attempt + 1
                candidate.in_time = in_time
                await candidate.save()
                return candidate
            }

            const user_answers = await User_answer.find({user_id, course_iteration_id}).sort({created_at: -1})
            if(user_answers.length===0 || (user_answers.length>0 && (date - date%86400000)-(user_answers[0].created_at-user_answers[0].created_at%86400000)<86400000*2)){
                in_time = true

                if((user_answers.length + 1) === course.lessons && is_correct){
                    const course_iteration_winner = await Course_iteration_winner.create({user_id, course_iteration_id, course_id: course_iteration.course_id})
                }

            }

            return await User_answer.create({user_id, course_iteration_id, lesson_id, in_time, is_correct, created_at: date})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userAnswerService()

const User_answer = require('../models/user_answer.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_iteration_winner = require('../models/course_iteration_winner.model')
const Course = require('../models/course.model')
const ApiError = require(`../errors/api.error`)
const User_wallet = require('../models/user_wallet.model')
const exeService = require('./exe.service')

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

            const course = await Course.findById(course_iteration.course_id)
            const user_answers = await User_answer.find({user_id, course_iteration_id}).sort({created_at: -1})
            if(user_answers.length===0 || (user_answers.length>0 && (date - date%86400000)-(user_answers[0].created_at-user_answers[0].created_at%86400000)<86400000*2)){
                in_time = true

                if((user_answers.length + 1) === course.lessons && is_correct){
                    const course_iteration_winner = await Course_iteration_winner.create({user_id, course_iteration_id, course_id: course_iteration.course_id})
                }

            }

            if((user_answers.length === course.lessons - 1) && is_correct){//author rewards//todo: прописати транзацкцію
                const exe_price = await exeService.getPrice()
                const usdt = (course.price)*0.1*0.8,
                    exe = ((course.price)*0.1*0.2)/exe_price
                let author_wallet = await User_wallet.findOne({user_id: course.user_id})
                author_wallet.usdt = author_wallet.usdt + usdt
                author_wallet.exe = author_wallet.exe + exe
                author_wallet.save()//todo: async
            }

            return await User_answer.create({user_id, course_iteration_id, lesson_id, in_time, is_correct, created_at: date})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userAnswerService()

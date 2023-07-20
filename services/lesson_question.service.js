const Lesson_question = require('../models/lesson_question.model')
const Lesson_answer = require('../models/lesson_answer.model')
const lessonAnswerService = require('./lesson_answer.service')
const ApiError = require(`../errors/api.error`)

class lessonQuestionService{

    async createFullQuestion(lesson_id, data){
        try{
            const lesson_question =  await Lesson_question.create({lesson_id, name: data.name, time_show: data.time_show})
            for(let i = 0; i < data.answers.length; i++){
                const question = await lessonAnswerService.create(lesson_question._id, data.answers[i].name, data.answers[i].right_answer)
            }

            return lesson_question
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async create(lesson_id, name, time_show) {
        try{
            const lesson_question =  await Lesson_question.create({lesson_id, name, time_show})

            return lesson_question
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByLesson(lesson_id) {
        try{
            return await Lesson_question.find({lesson_id}).sort({time_show: 1})
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async delete(lesson_question_id) {
        try{
            const lesson_question = await Lesson_question.findByIdAndDelete(lesson_question_id)
            const lesson_answers = await Lesson_answer.deleteMany({lesson_question_id})

            return {lesson_question, lesson_answers}
            }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(lesson_question_id){
        try {
            const lesson_question = await Lesson_question.findById(lesson_question_id)
            if(lesson_question === undefined){
                throw ApiError.badRequest('Користувача не знайдено!')
            }

            return lesson_question
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new lessonQuestionService()

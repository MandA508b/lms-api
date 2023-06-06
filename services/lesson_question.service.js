const Lesson_question = require('../models/lesson_question.model')
const Lesson_answer = require('../models/lesson_answer.model')
const lessonAnswerService = require('./lesson_answer.service')
const ApiError = require(`../errors/api.error`)

class lessonQuestionService{

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
            return await Lesson_question.find({lesson_id})
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

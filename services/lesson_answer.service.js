const Lesson_answer = require('../models/lesson_answer.model')
const ApiError = require(`../errors/api.error`)

class lessonAnswerService{

    async create(lesson_question_id, name, right_answer) {
        try{
            const lesson_answer =  await Lesson_answer.create({lesson_question_id, name, right_answer})

            return lesson_answer
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByQuestion(lesson_question_id) {
        try{
            return await Lesson_answer.find({lesson_question_id})
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async delete(lesson_answer_id) {
        try{
            return await Lesson_answer.findByIdAndDelete(lesson_answer_id)
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(lesson_answer_id){
        try {
            const lesson_answer = await Lesson_answer.findById(lesson_answer_id)
            if(lesson_answer === undefined){
                throw ApiError.badRequest('Користувача не знайдено!')
            }

            return lesson_answer
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateLessonAnswer(lesson_answer_id, name, is_true){
        try {
            return await Lesson_answer.findByIdAndUpdate(lesson_answer_id, {name, is_true})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new lessonAnswerService()

const ApiError = require(`../errors/api.error`)
const lessonAnswerService = require('../services/lesson_answer.service')

class lessonAnswerController{

    async create(req,res,next) {
        try {
            const {lesson_question_id, name, right_answer} = req.body
            if(!lesson_question_id || !name || right_answer===undefined) {
                return next(ApiError.badRequest())
            }
            const lesson_answer = await lessonAnswerService.create(lesson_question_id, name, right_answer)

            return res.json(lesson_answer)
        } catch (e) {
            next(e)
        }
    }

    async findAllByQuestion(req,res,next){
        try{
            const {lesson_question_id} = req.query
            if(!lesson_question_id){
                return next(ApiError.badRequest())
            }
            const lesson_answers = await lessonAnswerService.findAllByQuestion(lesson_question_id)

            return res.json(lesson_answers)
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {lesson_answer_id} = req.body
            if (!lesson_answer_id) {
                return next(ApiError.badRequest())
            }
            const lesson_answerData = await lessonAnswerService.delete(lesson_answer_id)

            return res.json(lesson_answerData)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {lesson_answer_id} = req.body
            if(lesson_answer_id === undefined){
                return next(ApiError.badRequest())
            }
            const lesson_answer = await lessonAnswerService.findById(lesson_answer_id)

            return res.json(lesson_answer)
        }catch (e) {
            next(e)
        }
    }

    async updateLessonAnswer(req, res, next){
        try{
            const {lesson_answer_id, name, is_true} = req.body
            if(!lesson_answer_id || !name || is_true===undefined){
                return next(ApiError.badRequest())
            }
            const lesson_answer = await lessonAnswerService.updateLessonAnswer(lesson_answer_id, name, is_true)

            return res.json(lesson_answer)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new lessonAnswerController()
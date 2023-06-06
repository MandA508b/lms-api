const ApiError = require(`../errors/api.error`)
const lessonQuestionService = require('../services/lesson_question.service')

class lessonQuestionController{

    async create(req,res,next) {
        try {
            const {lesson_id, name, time_show} = req.body
            if(!lesson_id || !name || !time_show) {
                return next(ApiError.badRequest())
            }
            const lesson_question = await lessonQuestionService.create(lesson_id, name, time_show)

            return res.json(lesson_question)
        } catch (e) {
            next(e)
        }
    }

    async findAllByLesson(req,res,next){
        try{
            const {lesson_id} = req.query
            if(!lesson_id){
                return next(ApiError.badRequest())
            }
            const lesson_questions = await lessonQuestionService.findAllByLesson(lesson_id)

            return res.json(lesson_questions)
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {lesson_question_id} = req.body
            if (!lesson_question_id) {
                return next(ApiError.badRequest())
            }
            const lesson_questionData = await lessonQuestionService.delete(lesson_question_id)

            return res.json(lesson_questionData)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {lesson_question_id} = req.query
            if(lesson_question_id === undefined){
                return next(ApiError.badRequest())
            }
            const lesson_question = await lessonQuestionService.findById(lesson_question_id)

            return res.json(lesson_question)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new lessonQuestionController()
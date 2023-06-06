const ApiError = require(`../errors/api.error`)
const lessonService = require('../services/lesson.service')

class lessonController{

    async create(req,res,next) {
        try {
            const {course_id, name, description} = req.body

            const video = req.file
            console.log({video})

            if(course_id===undefined || name===undefined || description===undefined || video === undefined) {
                return next(ApiError.badRequest())
            }

            const lesson = await lessonService.create(course_id, name, description, video)

            return res.json(lesson)
        } catch (e) {
            next(e)
        }
    }

    async findAllByCourse(req,res,next){
        try{
            const {course_id} = req.query
            if(!course_id){
                return next(ApiError.badRequest())
            }
            const lessons = await lessonService.findAllByCourse(course_id)

            return res.json(lessons)
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {lesson_id} = req.body
            if (!lesson_id) {
                return next(ApiError.badRequest())
            }
            const lessonData = await lessonService.delete(lesson_id)

            return res.json(lessonData)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {lesson_id} = req.query
            if(lesson_id === undefined){
                return next(ApiError.badRequest())
            }
            const lesson = await lessonService.findById(lesson_id)

            return res.json(lesson)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new lessonController()
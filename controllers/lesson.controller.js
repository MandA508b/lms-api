const ApiError = require(`../errors/api.error`)
const lessonService = require('../services/lesson.service')

class lessonController{

    async createFullLesson(req, res, next){
        try{
            const {data_} = req.body
            const data = JSON.parse(data_)
            const video = req.file
            if(!data.course_id || !data.name || !data.description || !data.questions || !video){
                return next(ApiError.badRequest())
            }
            const full_lesson = await lessonService.createFullLesson(data, video)

            return res.json(full_lesson)
        }catch (e) {
            next(e)
        }
    }

    async create(req,res,next) {
        try {
            const {course_id, name, description} = req.body

            const video = req.file

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

    async findActualLesson(req, res, next){
        try{
            const {course_id,course_iteration_id, user_id} = req.query
            if(!course_id || !course_iteration_id || !user_id){
                return next(ApiError.badRequest())
            }
            const lesson = await lessonService.findActualLesson(course_id, course_iteration_id, user_id)

            return res.json(lesson)
        }catch (e) {
            next(e)
        }
    }

}

module.exports = new lessonController()

/*

// EXAMPLE data_ TO CREATE FULL LESSON \\

    {
        "course_id": "64879ff3be578ab207620a54",
        "name": "test_lesson",
        "description": "test",
        "questions": [
            {
                "name": "test_question_1",
                "time_show": "10000",
                "answers":[
                    {
                        "name": "test_answer_1_1",
                        "right_answer": true
                    },
                    {
                        "name": "test_answer_1_2",
                        "right_answer": false
                    }
                ]
            },
            {
                "name": "test_question_2",
                "time_show": "20000",
                "answers":[
                    {
                        "name": "test_answer_2_1",
                        "right_answer": true
                    },
                    {
                        "name": "test_answer_2_2",
                        "right_answer": true
                    }
                ]
            }
        ]
    }

 */

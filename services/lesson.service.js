const Lesson = require('../models/lesson.model')
const Lesson_question = require('../models/lesson_question.model')
const lessonQuestionService = require('./lesson_question.service')
const ApiError = require(`../errors/api.error`)

class lessonService{

    async createFullLesson(data, video){
        try{
            const lesson =  await Lesson.create({course_id: data.course_id, name: data.name, description: data.description, video_name: video.filename})
            for(let i = 0; i < data.questions.length; i++){
                const question = await lessonQuestionService.createFullQuestion(lesson._id, data.questions[i])
            }

            return lesson
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async create(course_id, name, description, video) {
        try{
            const lesson =  await Lesson.create({course_id, name, description, video_name: video.filename})

            return lesson
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByCourse(course_id) {
        try{
            return await Lesson.find({course_id})
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async delete(lesson_id) {
        try{
            const lesson = await Lesson.findByIdAndDelete(lesson_id)
            const lesson_questions = await Lesson_question.find({lesson_id})
            let deleted_lesson_questions = []

            for(let key in lesson_questions){
                deleted_lesson_questions.push(await lessonQuestionService.delete(lesson_questions[key]._id))
            }

            return {lesson, lesson_questions: deleted_lesson_questions}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(lesson_id){
        try {
            const lesson = await Lesson.findById(lesson_id)
            if(lesson === undefined){
                throw ApiError.badRequest('Користувача не знайдено!')
            }

            return lesson
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new lessonService()

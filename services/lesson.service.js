const Lesson = require('../models/lesson.model')
const Lesson_question = require('../models/lesson_question.model')
const lessonQuestionService = require('./lesson_question.service')
const UserAnswer = require('../models/user_answer.model')
const timeService = require('./time.service')
const ApiError = require(`../errors/api.error`)

class lessonService{

    async createFullLesson(data, video){
        try{
            let created_at = await timeService.getDate(1);
            created_at = created_at.yyyy + '.' + created_at.mm + '.' + created_at.dd;
            const lesson =  await Lesson.create({course_id: data.course_id, name: data.name, description: data.description, video_name: video, created_at})
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
                throw ApiError.notFound('Lesson не знайдено!')
            }

            return lesson
        }catch (e) {
            console.log("error: ", e)
        }
    }

        async findActualLesson(course_id, course_iteration_id, user_id){
        try {
            const userAnswers = await UserAnswer.find({course_iteration_id, user_id}).sort({created_at: -1})//todo: -1?
            let point = userAnswers.length
            if(userAnswers.length > 0 && userAnswers[userAnswers.length - 1].is_correct === false){
                point -= 1
            }

            const lesson = await this.findAllByCourse(course_id)

            if(lesson.length <= point){
                throw ApiError.badRequest('Всі уроки пройдено!')
            }

            return lesson[point]
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new lessonService()

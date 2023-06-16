const Lesson = require('../models/lesson.model')
const LessonRating = require('../models/lesson_rating.model')
const Lesson_question = require('../models/lesson_question.model')
const UserAnswer = require('../models/user_answer.model')
const Course = require('../models/course.model')
const lessonQuestionService = require('./lesson_question.service')
const timeService = require('./time.service')
const ApiError = require(`../errors/api.error`)

class lessonService{

    async createFullLesson(data, video){
        try{

            let created_at = await timeService.getDate(1);
            created_at = created_at.yyyy + '.' + created_at.mm + '.' + created_at.dd + '.' + created_at.h + '.' + created_at.m + '.' + created_at.s;
            const lesson =  await Lesson.create({course_id: data.course_id, name: data.name, description: data.description, video_name: video.filename, created_at})
            const lesson_rating = await LessonRating.create({lesson_id: lesson._id, course_id: data.course_id})
            const course = await Course.findById(data.course_id)
            course.lessons = course.lessons + 1
            await course.save()

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

            const course = await Course.findById(course_id)
            course.lessons = course.lessons + 1
            await course.save()
            let created_at = await timeService.getDate(1);//todo: add numbering
            created_at = created_at.yyyy + '.' + created_at.mm + '.' + created_at.dd;
            const lesson =  await Lesson.create({course_id, name, description, video_name: video.filename, created_at})
            return lesson
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByCourse(course_id) {
        try{
            return await Lesson.find({course_id}).sort({created_at: 1})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByCourseAuthor(course_id) {
        try{
            const lessons = await Lesson.find({course_id}).sort({created_at: 1})
            let lessons_list = []

            for(let key in lessons){
                const lessons_rating = await LessonRating.findOne({lesson_id: lessons[key]._id})
                lessons_list.push({lesson: lessons[key], rating: {rating: lessons_rating.rating, votes: lessons_rating.votes}})
            }

            return lessons_list
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
            const lesson = await this.findAllByCourse(course_id)
            const userAnswers = await UserAnswer.find({course_iteration_id, user_id}).sort({created_at: 1})//todo: -1?
            let point = userAnswers.length

            if(lesson.length <= point){
                throw ApiError.badRequest('Всі уроки пройдено!')
            }

            if(userAnswers.length===0)return lesson[0]
            if(userAnswers[userAnswers.length - 1].is_correct === false){
                point -= 1
            }
            let date = await timeService.getDate(1);
            date = date.yyyy + '.' + date.mm + '.' + date.dd;
            if(userAnswers[userAnswers.length - 1].created_at===date){
                return null//todo: return something else?
            }


            return lesson[point]
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new lessonService()

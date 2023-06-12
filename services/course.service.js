const Course = require('../models/course.model')
const Lesson = require('../models/lesson.model')
const lessonService = require('./lesson.service')
const courseIterationService = require('../services/course_iteration.service')
const ApiError = require(`../errors/api.error`)

class courseService{

    async create(user_id, name, description) {
        try{
            const course = await Course.create({user_id, name, description})

            return {course}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll() {
        try{
            return await Course.find()
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async delete(course_id) {
        try{
            const course = await Course.findByIdAndDelete(course_id)
            const lessons = await Lesson.find({course_id})
            let deleted_lessons = []

            for (let key in lessons) {
                deleted_lessons.push(await lessonService.delete(lessons[key]._id))
            }

            return { course, lessons: deleted_lessons}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(course_id){
        try {
            const course = await Course.findById(course_id)
            if(course === undefined){
                throw ApiError.badRequest('Користувача не знайдено!')
            }

            return course
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async publishCourse(course_id){
        try {
            const course = await Course.findById(course_id)
            if(course===null || course.is_published===true){
                throw ApiError.notFound('Курс не знайдено!')
            }
            course.is_published=true
            await course.save()

            const course_registration = await courseIterationService.create(course._id)

            return course
        }catch (e) {
            console.log("error: ", e)
        }
    }


}
module.exports = new courseService()

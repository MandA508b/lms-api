const Course = require('../models/course.model')
const Lesson = require('../models/lesson.model')
const lessonService = require('./lesson.service')
const CourseRating = require('../models/course_rating.model')
const courseRegistrationService = require('../services/course_registration.service')
const courseIterationService = require('./course_iteration.service')
const ApiError = require(`../errors/api.error`)

class courseService{

    async create(user_id, name, description) {
        try{
            const course = await Course.create({user_id, name, description})
            const course_rating = await CourseRating.create({course_id: course._id})
            return {course, course_rating}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(user_id) {
        try{
            const courses = await Course.find({is_published: true})
            if(!user_id){
                return courses
            }
            let courses_list = []
            for (let key in courses) {
                const courseRating = await CourseRating.findOne({course_id: courses[key]._id})
                const course_iteration = await courseIterationService.actualIteration(courses[key]._id)
                const data = await courseRegistrationService.actualRegistration(user_id, course_iteration, courses[key]._id)
                if(data===null){
                    courses_list.push({course: courses[key], registered: false, participants: course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}})
                    continue;
                }

                const actualLesson = await lessonService.findActualLesson(courses[key]._id, course_iteration._id, user_id)

                courses_list.push({course: courses[key], actualLesson, registered: true, participants: course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}})
            }

            return courses_list
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findByAuthor(author_id) {
        try{
            const courses = await Course.find({is_published: true, user_id: author_id})
            let courses_list = []
            for (let key in courses) {
                const courseRating = await CourseRating.findOne({course_id: courses[key]._id})
                const course_iteration = await courseIterationService.actualIteration(courses[key]._id)

                const lessons = await lessonService.findAllByCourseAuthor(courses[key]._id)

                courses_list.push({course: courses[key], participants: course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, lessons})
            }

            return courses_list
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
                throw ApiError.badRequest('Курс не знайдено!')
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

const Course = require('../models/course.model')
const Lesson = require('../models/lesson.model')
const lessonService = require('./lesson.service')
const CourseRating = require('../models/course_rating.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_registration = require('../models/course_registration.model')
const courseRegistrationService = require('../services/course_registration.service')
const courseIterationService = require('./course_iteration.service')
const ApiError = require(`../errors/api.error`)

class courseService{

    async create(user_id, name, description, duration, price) {
        try{
            const course = await Course.create({user_id, name, description, duration, price})
            const course_rating = await CourseRating.create({course_id: course._id})
            return {course, course_rating}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(user_id) {
        try{
            const courses = await Course.find({is_published: true})
            let courses_list = []
            for (let key in courses) {
                const courseRating = await CourseRating.findOne({course_id: courses[key]._id})
                const course_iteration = await courseIterationService.actualIteration(courses[key]._id)
                console.log(courses[key].name, course_iteration, courses[key]._id)
                if(course_iteration===undefined || (course_iteration.course_iteration===null && course_iteration.next_course_iteration===null))continue;
                const actual_registration = await courseRegistrationService.actualRegistration(user_id, course_iteration, courses[key]._id)
                if(actual_registration.course_registration===null && actual_registration.next_course_registration===null){
                    if(course_iteration.course_iteration!==null){
                        courses_list.push({course: courses[key], registered: false, participants: course_iteration.course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, course_iteration: course_iteration.course_iteration})
                    }else{
                            courses_list.push({course: courses[key], registered: false, participants: course_iteration.next_course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, course_iteration: course_iteration.next_course_iteration})
                        }
                    continue;
                }
                let actualLesson = null
                if(actual_registration.course_registration!==null) {
                    actualLesson = await lessonService.findActualLesson(courses[key]._id, course_iteration.course_iteration._id, user_id)
                }
                if(course_iteration.course_iteration!==null){
                courses_list.push({course: courses[key], actualLesson, registered: true, participants: course_iteration.course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, course_iteration: course_iteration.course_iteration})
                    }else{
                    courses_list.push({course: courses[key], actualLesson, registered: true, participants: course_iteration.next_course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, course_iteration: course_iteration.next_course_iteration})
                }
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
                const course_iteration = await courseIterationService.actualIteration(courses[key]._id)
                if(course_iteration===undefined || (course_iteration.course_iteration===null && course_iteration.next_course_iteration===null))continue;
                const courseRating = await CourseRating.findOne({course_id: courses[key]._id})

                if(course_iteration.course_iteration!==null){
                    const lessons = await lessonService.findAllByCourseAuthor(courses[key]._id, course_iteration.course_iteration._id)
                    courses_list.push({course: courses[key], participants: course_iteration.course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, lessons, course_iteration: course_iteration.course_iteration})
                    }else{
                    const lessons = await lessonService.findAllByCourseAuthor(courses[key]._id, course_iteration.next_course_iteration._id)
                    courses_list.push({course: courses[key], participants: course_iteration.next_course_iteration.participants, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, lessons, course_iteration: course_iteration.next_course_iteration})
                }
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
            const courseRating = await CourseRating.findOne({course_id: course_id})
            const course_iteration = await courseIterationService.actualIteration(course_id)
            if(course_iteration===undefined || (course_iteration.course_iteration===null)) {
                return {course, courseRating: {rating: courseRating.rating, votes: courseRating.votes}}
            }
            const lessons = await lessonService.findAllByCourseAuthor(course_id, course_iteration.course_iteration._id)

            return {course, courseRating: {rating: courseRating.rating, votes: courseRating.votes}, lessons, course_iteration_id: course_iteration._id, participants: course_iteration.course_iteration.participants}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findUserCourses(user_id){
        try {
            const user_iterations = await Course_registration.find({user_id})
            console.log(user_iterations)
            let courses = []
            for (let key in user_iterations) {
                const course = await Course.findById(user_iterations[key].course_id)
                const course_iteration = await Course_iteration.findById(user_iterations[key].course_iteration_id)
                const course_rating = await CourseRating.findOne({course_id: user_iterations[key].course_id})
                const passes_lessons = await lessonService.findAllPassedByCourse(user_iterations[key].course_iteration_id, user_id)
                const actual_lesson = await lessonService.findActualLesson(user_iterations[key].course_id,user_iterations[key].course_iteration_id, user_id)
                courses.push({course, course_rating, passes_lessons, actual_lesson, course_iteration})
            }

            return courses
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async publishCourse(course_id, start_at){
        try {
            const course = await Course.findById(course_id)
            if(course===null || course.is_published===true){
                throw ApiError.notFound('Курс не знайдено або вже розпочато!')
            }
            course.is_published=true
            await course.save()
            const course_registration = await courseIterationService.create(course._id, start_at, course.duration)

            return course
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateName(course_id, name){
        try {
            return await Course.findByIdAndUpdate(course_id, {name})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateDescription(course_id, description){
        try {
            return await Course.findByIdAndUpdate(course_id, {description})
        }catch (e) {
            console.log("error: ", e)
        }
    }


}
module.exports = new courseService()

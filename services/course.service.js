const Course = require('../models/course.model')
const Lesson = require('../models/lesson.model')
const lessonService = require('./lesson.service')
const CourseRating = require('../models/course_rating.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_registration = require('../models/course_registration.model')
const User_answer = require('../models/user_answer.model')
const User = require('../models/user.model')
const courseRegistrationService = require('../services/course_registration.service')
const courseIterationService = require('./course_iteration.service')
const Language = require('../models/language.model')
const ApiError = require(`../errors/api.error`)
const {fnAddWatermark} = require("ffmpeg/lib/video");
const {cache} = require("express/lib/application");

class courseService{

    async create(user_id, name, description, duration, price, language_id) {
        try{
            const course = await Course.create({user_id, name, description, duration, price, language_id})
            const course_rating = await CourseRating.create({course_id: course._id})
            return {course, course_rating}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(user_id, filter) {
        try{
            async function compareParticipants(a, b) {
                if(a===b)return 0

                const course_iteration_a = await courseIterationService.actualIteration(a._id)
                const course_iteration_b = await courseIterationService.actualIteration(b._id)

                a = course_iteration_a.course_iteration
                b = course_iteration_b.course_iteration
                if(a===null)a=course_iteration_a.next_course_iteration
                if(b===null)b=course_iteration_b.next_course_iteration

                if (a.participants < b.participants) {
                    return 1;
                } else if (a.participants >= b.participants) {
                    return -1;
                }
                return 0;
            }
            async function compareRating(a, b) {
                if(a===b)return 0

                const course_rating_a = await CourseRating.findOne({course_id: a._id})
                const course_rating_b = await CourseRating.findOne({course_id: b._id})
                if (course_rating_a.rating < course_rating_b.rating) {
                    return -1;
                } else if (course_rating_a.rating >= course_rating_b.rating) {
                    return 1;
                }
                return 0;
            }
            function comparePrice(a, b) {
                if(a===b)return 0
                if (a.price < b.price) {
                    return -1;
                } else if (a.price >= b.price) {
                    return 1;
                }
                return 0;
            }
            async function compareBank(a, b) {
                if(a===b)return 0
                const course_iteration_a = await courseIterationService.actualIteration(a._id)
                const course_iteration_b = await courseIterationService.actualIteration(b._id)

                let a_it = course_iteration_a.course_iteration
                let b_it = course_iteration_b.course_iteration

                if(a_it===null)a_it=course_iteration_a.next_course_iteration
                if(b_it===null)b_it=course_iteration_b.next_course_iteration
                // console.log(a_it.participants*a.price, b_it.participants*b.price)
                if (a_it.participants*a.price < b_it.participants*b.price) {
                    return -1;
                } else if (a_it.participants*a.price >= b_it.participants*b.price) {
                    return 1;
                }
                return 0;
            }

            async function sort(array, compareFn) {
                // Якщо масив має менше двох елементів, він вже відсортований.
                if (array.length < 2) {
                    return array;
                }

                // Вибираємо опорний елемент.
                const pivot = array[Math.floor(array.length / 2)];

                // Розбиваємо масив на два підмасиви: елементи, менші за опорний елемент, та елементи, більші за опорний елемент.
                const smaller = [];
                const larger = [];
                for (const element of array) {
                    if (await compareFn(element, pivot) < 0) {
                        smaller.push(element);
                    } else if (await compareFn(element, pivot) > 0) {
                        larger.push(element);
                    }
                }

                // Виконуємо сортування для кожного підмасиву рекурсивно.
                return (await sort(smaller, compareFn)).concat([pivot], await sort(larger, compareFn));
            }

            let courses = await Course.find({is_published: true});


            switch (filter){//filter: participants, rating, price, bank
                case 'participants':
                    courses = await sort(courses, compareParticipants)
                    break;
                case 'rating':
                    courses = await sort(courses, compareRating)
                    break;
                case 'price':
                    courses = await sort(courses, comparePrice)
                    break;
                case 'bank':
                    courses = await sort(courses, compareBank)
                    break;
                default:
                    break;
            }
            let courses_list = []
            for (let key in courses) {
                try{
                    const course_rating = await CourseRating.findOne({course_id: courses[key]._id})
                    const language = await Language.findById(courses[key].language_id)
                    const course_iteration = await courseIterationService.actualIteration(courses[key]._id)

                    if(course_iteration===undefined || (course_iteration.course_iteration===null && course_iteration.next_course_iteration===null))continue;

                    const actual_registration = await courseRegistrationService.actualRegistration(user_id, course_iteration, courses[key]._id)
                    if(actual_registration.course_registration===null && actual_registration.next_course_registration===null){
                        if(course_iteration.course_iteration!==null){
                            courses_list.push({course: courses[key], registered: false, participants: course_iteration.course_iteration.participants, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, course_iteration: course_iteration.course_iteration, language})
                        }else{
                            courses_list.push({course: courses[key], registered: false, participants: course_iteration.next_course_iteration.participants, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, course_iteration: course_iteration.next_course_iteration, language})
                        }
                        continue;
                    }
                    let actual_lesson = null
                    if(actual_registration.course_registration!==null) {
                        actual_lesson = await lessonService.findActualLesson(courses[key]._id, course_iteration.course_iteration._id, user_id)
                    }
                    if(course_iteration.course_iteration!==null){
                        courses_list.push({course: courses[key], actual_lesson, registered: true, participants: course_iteration.course_iteration.participants, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, course_iteration: course_iteration.course_iteration, language})
                    }else{
                        courses_list.push({course: courses[key], actual_lesson, registered: true, participants: course_iteration.next_course_iteration.participants, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, course_iteration: course_iteration.next_course_iteration, language})
                    }
                }catch (e) {

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
                const language = await Language.findById(courses[key].language_id)
                const course_iteration = await courseIterationService.actualIteration(courses[key]._id)
                if(course_iteration===undefined || (course_iteration.course_iteration===null && course_iteration.next_course_iteration===null))continue;
                const course_rating = await CourseRating.findOne({course_id: courses[key]._id})

                if(course_iteration.course_iteration!==null){
                    const lessons = await lessonService.findAllByCourseAuthor(courses[key]._id, course_iteration.course_iteration._id)
                    courses_list.push({course: courses[key], participants: course_iteration.course_iteration.participants, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, lessons, course_iteration: course_iteration.course_iteration, language})
                }else{
                    const lessons = await lessonService.findAllByCourseAuthor(courses[key]._id, course_iteration.next_course_iteration._id)
                    courses_list.push({course: courses[key], participants: course_iteration.next_course_iteration.participants, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, lessons, course_iteration: course_iteration.next_course_iteration, language})
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
            const language = await Language.findById(course.language_id)
            const course_rating = await CourseRating.findOne({course_id: course_id})
            const course_iteration = await courseIterationService.actualIteration(course_id)
            if(course_iteration===undefined || (course_iteration.course_iteration===null)) {
                return {course, course_rating: {rating: course_rating.rating, votes: course_rating.votes}}
            }
            const lessons = await lessonService.findAllByCourseAuthor(course_id, course_iteration.course_iteration._id)

            return {course, course_rating: {rating: course_rating.rating, votes: course_rating.votes}, lessons, course_iteration_id: course_iteration._id, participants: course_iteration.course_iteration.participants, language}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findUserCourses(user_id){
        try {
            const user_iterations = await Course_registration.find({user_id})
            let courses = []
            const date = new Date().getTime()
            for (let key in user_iterations) {
                try{
                    const course = await Course.findById(user_iterations[key].course_id)
                    const language = await Language.findById(course.language_id)
                    const course_iteration = await Course_iteration.findById(user_iterations[key].course_iteration_id)
                    const course_rating = await CourseRating.findOne({course_id: user_iterations[key].course_id})
                    const passed_lessons = await lessonService.findAllPassedByCourse(user_iterations[key].course_iteration_id, user_id)

                    let actual_lesson = null
                    if(date >= course_iteration.start_at){
                        actual_lesson = await lessonService.findActualLesson(user_iterations[key].course_id,user_iterations[key].course_iteration_id, user_id)
                    }

                    courses.push({course, course_rating, passed_lessons, actual_lesson, course_iteration, language})
                }catch (e) {
                    
                }
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

    async coursesStatistics(){
        try {
            const courses = await Course.find({is_published: true})
            let courses_statistic = []
            for (let key in courses) {
                const actual_iteration = await courseIterationService.actualIteration(courses[key]._id)
                if(actual_iteration.course_iteration===null){
                    continue
                }
                const actual_registrations = await Course_registration.find({course_iteration_id: actual_iteration.course_iteration._id})
                let users = []
                for(let a_r_key in actual_registrations){
                    const user = await User.findById(actual_registrations[a_r_key].user_id)
                    users.push(user.email)
                }
                const lessons = await Lesson.find({course_id: courses[key]._id})
                let lessonsData = []
                for(let lessons_key in lessons){
                    const user_answers = await User_answer.find({course_iteration_id: actual_iteration.course_iteration._id, lesson_id: lessons[lessons_key]._id}).sort({user_id: 1})
                    let lessons_users = []
                    for (let u_a_key in user_answers) {
                          const user = await User.findById(user_answers[u_a_key].user_id)
                          lessons_users.push({user: user.email, user_answer: {is_correct: user_answers[u_a_key].is_correct, in_time: user_answers[u_a_key].in_time, attempt: user_answers[u_a_key].attempt}})
                    }
                    lessonsData.push({lesson: lessons[lessons_key].name, users: lessons_users})
                }
                courses_statistic.push({courseName: courses[key].name, users, lessonsData})
            }
            return courses_statistic
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseService()

const Lesson = require('../models/lesson.model')
const LessonRating = require('../models/lesson_rating.model')
const Lesson_question = require('../models/lesson_question.model')
const User_answer = require('../models/user_answer.model')
const Course = require('../models/course.model')
const lessonQuestionService = require('./lesson_question.service')
const ApiError = require(`../errors/api.error`)
const AWS = require('aws-sdk')
let crypto = require('crypto')
class lessonService{

    async uploadVideo(video, video_name){
        try{
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            })

            const bucketName = process.env.AWS_BUCKET_NAME;
            const newFileNameKey= `video/${video_name}`

            const params = {
                Bucket: bucketName,
                Key: newFileNameKey,
                Body: video.buffer,
            };

            return await s3.putObject(params, (err, data) => {
                if (err) {
                    console.log("error: ", err)
                    throw ApiError.internal('Problem with upload video!')
                } else {
                    console.log("success: ")
                }
            }).promise()
        }catch (e) {
            console.log("Error: ", e)
        }
    }
    async createFullLesson(data, video){
        try{
            let video_name = crypto.randomBytes(30).toString('hex') + '.mp4'
            await this.uploadVideo(video, video_name)
            video_name = process.env.CDN_URL + 'video/' + video_name
            let created_at = new Date().getTime()
            const course = await Course.findById(data.course_id)
            const lesson =  await Lesson.create({course_id: data.course_id, name: data.name, description: data.description, video_name, created_at, video_duration: data.duration, number: course.lessons + 1})
            const lesson_rating = await LessonRating.create({lesson_id: lesson._id, course_id: data.course_id})
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
    async testVideo(video){
        try{
            console.log('test video service start')

            return video.filename
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async create(course_id, name, description, video, duration) {
        try{
            let video_name = crypto.randomBytes(30).toString('hex') + '.mp4'
            await this.uploadVideo(video, video_name)
            video_name = process.env.CDN_URL + 'video/' + video_name

            const course = await Course.findById(course_id)
            let created_at = new Date().getTime()
            const lesson =  await Lesson.create({course_id, name, description, video_name, created_at, video_duration: duration, number: course.lessons + 1})
            course.lessons = course.lessons + 1
            await course.save()
            return lesson
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByCourse(course_id) {
        try{
            return await Lesson.find({course_id}).sort({number: 1})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllPassedByCourse(course_iteration_id, user_id) {
        try{
            let passed_lessons = await User_answer.find({course_iteration_id, user_id})
            return passed_lessons
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAllByCourseAuthor(course_id, course_iteration_id) {
        try{
            const lessons = await Lesson.find({course_id}).sort({number: 1})
            let lessons_list = []

            for(let key in lessons){
                const lessons_rating = await LessonRating.findOne({lesson_id: lessons[key]._id})
                const passed = await User_answer.find({course_iteration_id, lesson_id: lessons[key]._id, is_correct: true})
                lessons_list.push({lesson: lessons[key], rating: {rating: lessons_rating.rating, votes: lessons_rating.votes}, passed: passed.length})
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
            const userAnswers = await User_answer.find({course_iteration_id, user_id}).sort({created_at: 1})
            let point = userAnswers.length
            const tillFinish = lesson.length - point
            let missedDays = 0

            const date = new Date().getTime()

            if(userAnswers.length > 0 && tillFinish !== 0)
            missedDays = Math.max(0, Math.floor((date - userAnswers[userAnswers.length - 1].created_at)/86400000))

            if(lesson.length <= point){
                return {lesson: null, missedDays, tillFinish}
            }

            if(userAnswers.length===0)return {lesson: lesson[0], missedDays, tillFinish}
            if(userAnswers[userAnswers.length - 1].is_correct === false){
                point -= 1
            }


            if((userAnswers[userAnswers.length - 1].created_at - userAnswers[userAnswers.length - 1].created_at%86400000)===(date - date%86400000)){
                return {lesson: null, missedDays, tillFinish}
            }

            return {lesson: lesson[point], missedDays, tillFinish}
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateNumberLesson(lesson_id, number){
        try {
            const lesson = await Lesson.findById(lesson_id)
            if(lesson===null){
                throw ApiError.notFound()
            }
            const lessons = await Lesson.find({course_id: lesson.course_id}).sort({number: 1})
            if(lessons.length < number || number <= 0){
                throw ApiError.badRequest()
            }
            if(lesson.number === number)return lessons
            if(lesson.number < number){
                for(let i = lesson.number + 1; i <= number; i++){
                    lessons[i - 1].number = lessons[i - 1].number - 1
                    lessons[i - 1].save()
                }
                lessons[lesson.number - 1].number = number
                await lessons[lesson.number - 1].save()
            }else{
                for(let i = number; i < lesson.number ; i++){
                    lessons[i - 1].number = lessons[i - 1].number + 1
                    lessons[i - 1].save()
                }
                lessons[lesson.number - 1].number = number
                await lessons[lesson.number - 1].save()
            }
            lessons.sort()
            return  lessons
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateName(lesson_id, name){
        try {
            return await Lesson.findByIdAndUpdate(lesson_id, {name})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateDescription(lesson_id, description){
        try {
            return await Lesson.findByIdAndUpdate(lesson_id, {description})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new lessonService()



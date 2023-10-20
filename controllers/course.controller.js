const ApiError = require(`../errors/api.error`)
const courseService = require('../services/course.service')

class courseController{

    async create(req,res,next) {
        try {
            const {user_id, name, description, duration, price, language_id} = req.body
            if(!user_id || !name || !description || !duration || price === undefined || !language_id) {
                return next(ApiError.badRequest())
            }
            const course = await courseService.create(user_id, name, description, duration, price, language_id)

            return res.json(course)
        } catch (e) {
            next(e)
        }
    }

    async findAll(req,res,next){
        try{
            const {user_id} = req.query
            const courses = await courseService.findAll(user_id)

            return res.json(courses)
        }catch (e) {
            next(e)
        }
    }

    async findByAuthor(req,res,next){
        try{
            const {author_id} = req.query
            if(!author_id){
                return next(ApiError.badRequest())
            }
            const courses = await courseService.findByAuthor(author_id)

            return res.json(courses)
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {course_id} = req.body
            if (!course_id) {
                return next(ApiError.badRequest())
            }
            const courseData = await courseService.delete(course_id)

            return res.json(courseData)
        } catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {course_id} = req.query
            if(course_id === undefined){
                return next(ApiError.badRequest())
            }
            const course = await courseService.findById(course_id)

            return res.json(course)
        }catch (e) {
            next(e)
        }
    }

    async findUserCourses(req, res, next){
        try{
            const {user_id} = req.query
            if(user_id === undefined){
                return next(ApiError.badRequest())
            }
            const course = await courseService.findUserCourses(user_id)

            return res.json(course)
        }catch (e) {
            next(e)
        }
    }

    async publishCourse(req ,res, next) {
        try {
            const {course_id, start_at} = req.body
            if (!course_id || !start_at) {
                return next(ApiError.badRequest())
            }
            const course = await courseService.publishCourse(course_id, start_at)

            return res.json(course)
        } catch (e) {
            next(e)
        }
    }

    async updateName(req ,res, next) {
        try {
            const {course_id, name} = req.body
            if (!course_id || !name) {
                return next(ApiError.badRequest())
            }
            const course = await courseService.updateName(course_id, name)

            return res.json(course)
        } catch (e) {
            next(e)
        }
    }

    async updateDescription(req ,res, next) {
        try {
            const {course_id, description} = req.body
            if (!course_id || !description) {
                return next(ApiError.badRequest())
            }
            const course = await courseService.updateDescription(course_id, description)

            return res.json(course)
        } catch (e) {
            next(e)
        }
    }

    async coursesStatistics(req ,res, next) {
        try {
            const courses_statistic = await courseService.coursesStatistics()

            return res.json(courses_statistic)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new courseController()
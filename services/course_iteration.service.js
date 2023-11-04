const Course_iteration = require('../models/course_iteration.model')
const Course = require('../models/course.model')
const ApiError = require(`../errors/api.error`)
const courseWinnerPayoutService = require('./course_winner_payout.service')

class courseIterationService{

    async createIterationsMonthly(){
        try{
            let date = new Date().getTime()
            date = date - date % 86400000
            let start_at = date

            const courses = await Course.find()
            for (let key in courses) {
                try{

                    start_at = date + courses[key].duration * 86400000
                    const finish_at = start_at + courses[key].duration * 86400000
                    const finish_at_next = finish_at + courses[key].duration * 86400000

                    const candidate_course_iteration = await Course_iteration.find({course_id: courses[key]._id , finish_at: {$gt: start_at} })
                    if(candidate_course_iteration.length>1 || courses[key].is_published ===false)continue;
                    if(candidate_course_iteration.length===0){
                        const course_iteration = await Course_iteration.create({course_id: courses[key]._id, start_at, finish_at})
                    }
                    const next_course_iteration = await Course_iteration.create({course_id: courses[key]._id, start_at: finish_at, finish_at: finish_at_next})

                    // calculating course winners for exist iterations
                    await courseWinnerPayoutService.calcPayoutsForCourseIteration(courses[key])
                }catch(e){
                    courses[key].is_published=false
                    courses[key].save()
                    console.log("error on courseId: ",courses[key], e)
                }
            }

        }catch (e) {
            console.log("error: ", e)
        }
    }

    async create(course_id, start_at, duration) {
        try{
            start_at = start_at - start_at % 86400000
            const finish_at = start_at + duration * 86400000
            const finish_at_next = start_at + duration * 86400000 * 2
            const course_iteration = await Course_iteration.create({course_id, start_at: finish_at , finish_at: finish_at_next})
            return await Course_iteration.create({course_id, start_at, finish_at})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(course_iteration_id){
        try {
            const course_iteration = await Course_iteration.findById(course_iteration_id)
            console.log(course_iteration)
            if(course_iteration === null){
                throw ApiError.badRequest('Курс не знайдено!')
            }

            return course_iteration
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findByUser(user_id){
        try {
            const course_iterations = await Course_iteration.find({user_id})//todo : modify by query
            let relevant_course_iterations =[]

            let date = new Date().getTime()

            for(let key in course_iterations){
                if(course_iterations[key].start_at <= date && course_iterations[key].finish_at > date){
                    const course = await Course.findById(course_iterations[key].course_id)
                    relevant_course_iterations.push({course_iteration_id: course_iterations[key]._id, course})
                }
            }

            return relevant_course_iterations
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async actualIteration(course_id){
        try{
            const course = await Course.findById(course_id)
            if (course===null){
                throw ApiError.badRequest()
            }
            let date = new Date().getTime()

            const course_iteration = await Course_iteration.findOne({course_id,  finish_at: { $gte: date }, start_at: { $lte: date } })
            const next_course_iteration = await Course_iteration.find({ course_id, start_at: { $gt: date } }).sort({start_at: 1})
            if(next_course_iteration===[])
                return {course_iteration, next_course_iteration: null}
            return {course_iteration, next_course_iteration: next_course_iteration[0]}
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseIterationService()

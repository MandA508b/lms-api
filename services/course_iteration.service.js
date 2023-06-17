const Course_iteration = require('../models/course_iteration.model')
const ApiError = require(`../errors/api.error`)
const Course =require('./course.service')
const timeService = require('./time.service')

class courseIterationService{

    async createIterationsMonthly(){
        try{
            let start_at = await timeService.getDate(2);
            start_at = start_at.yyyy + '.' + start_at.mm + '.' + start_at.dd;

            let finish_at = await timeService.getDate(3);
            finish_at = finish_at.yyyy + '.' + finish_at.mm + '.' + finish_at.dd;

            const courses = await Course.findAll()
            for (let key in courses) {
                const course_iteration = await this.create(courses[key]._id, start_at, finish_at)
                //todo: calculate exist iterations
            }

        }catch (e) {
            console.log("error: ", e)
        }
    }

    async create(course_id) {
        try{
            let prev_start = await timeService.getDate(1);
            prev_start = prev_start.yyyy + '.' + prev_start.mm + '.' + "01";

            let start_at = await timeService.getDate(2);
            start_at = start_at.yyyy + '.' + start_at.mm + '.' + "01";

            let finish_at = await timeService.getDate(3);
            finish_at = finish_at.yyyy + '.' + finish_at.mm + '.' + "01";

            const course_iteration = await Course_iteration.create({course_id, start_at: prev_start , finish_at: start_at})
            return await Course_iteration.create({course_id, start_at, finish_at})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(course_iteration_id){
        try {
            const course_iteration = await Course_iteration.findById(course_iteration_id)
            if(course_iteration === undefined){
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

            let date = await timeService.getDate(1);
            date = date.yyyy + '.' + date.mm + '.' + date.dd;

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
            let date = await timeService.getDate(1)
            let date2 = await timeService.getDate(2)
            date = date.yyyy + '.' + date.mm + '.01';
            date2 = date2.yyyy + '.' + date2.mm + '.01';
            const course_iteration = await Course_iteration.findOne({course_id, start_at: date})
            const next_course_iteration = await Course_iteration.findOne({course_id, start_at: date2})
            return {course_iteration, next_course_iteration}
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseIterationService()

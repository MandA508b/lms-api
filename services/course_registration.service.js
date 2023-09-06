const Course_registration = require('../models/course_registration.model')
const User = require('../models/user.model')
const Course = require('../models/course.model')
const ApiError = require(`../errors/api.error`)
const courseIterationService = require('./course_iteration.service')
const transactionService = require('./transaction.service')
const exeService = require('./exe.service')
const jwt = require("jsonwebtoken");
const Transaction = require("../models/transaction.model");

class courseRegistrationService{

    async create(course_id, user_id, exe_price) {
        try{
            const user = await User.findById(user_id)//checking for the relevance of the user
            const course = await Course.findById(course_id)//checking for the relevance of the course
            if(!exe_price){
                const exe_price = await exeService.getPrice()
            }

            if(user === null || course === null || course.is_published === false){
                throw ApiError.notFound('Користувача або курсу не знайдено!')
            }//checked!

            const buy_course = await transactionService.buyCourse(user_id, course.price, exe_price)
            if(!buy_course){
                throw ApiError.badRequest('не вдалось купити курс!')
            }
            if(user === null || course === null || course.is_published === false){
                throw ApiError.notFound('Користувача або курсу не знайдено!')
            }

            const course_iterations = await courseIterationService.actualIteration(course_id)
            // console.log({course_iterations})
            if(course_iterations.course_iteration !== null){
                const candidate = await Course_registration.findOne({course_id, user_id, course_iteration_id: course_iterations.course_iteration._id})
                if(candidate!==null){
                    return candidate
                }
                let date = new Date().getTime()
                date = date - date % 86400000
                const days_until_end = (course_iterations.course_iteration.finish_at - date)/86400000
                if(days_until_end >= course.lessons){//registration actual iteration
                    const course_registration = await Course_registration.create({course_id, user_id, course_iteration_id: course_iterations.course_iteration._id})
                    course_iterations.course_iteration.participants = course_iterations.course_iteration.participants + 1
                    await course_iterations.course_iteration.save()
                    return course_registration
                }
            }


            if(course_iterations.next_course_iteration === null){
                throw ApiError.notFound('Ітерацію не знайдено!')
            }

            const next_candidate = await Course_registration.findOne({course_id, user_id, course_iteration_id: course_iterations.next_course_iteration._id})
            if(next_candidate!==null){
                return next_candidate
            }
            //registration next iteration
            const course_registration = await Course_registration.create({course_id, user_id, course_iteration_id: course_iterations.next_course_iteration._id})
            course_iterations.next_course_iteration.participants = course_iterations.next_course_iteration.participants + 1
            await course_iterations.next_course_iteration.save()
            return course_registration
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(course_registration_id){
        try {
            const course_registration = await Course_registration.findById(course_registration_id)
            if(course_registration === undefined){
                throw ApiError.notFound('Реєстрацію на курс не знайдено!')
            }

            return course_registration
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findByUser(user_id){
        try{
            const course_registrations = await Course_registration.find({user_id})
            let user_course_registrations = []
            for (let key in course_registrations) {
                const course = await Course.findById(course_registrations[key]._id)
                user_course_registrations.push(course)
            }

            return user_course_registrations
        }catch (e) {
            console.log("error ", e)
        }
    }

    async actualRegistration(user_id, course_iteration, course_id){
        try{
            let course_registration = null, next_course_registration = null
            if(course_iteration.course_iteration){
                course_registration = await Course_registration.findOne({user_id, course_id, course_iteration_id: course_iteration.course_iteration._id})
            }
            if(course_iteration.next_course_iteration){
                next_course_registration = await Course_registration.findOne({user_id, course_id, course_iteration_id: course_iteration.next_course_iteration._id})
            }
            return {course_registration, next_course_registration}
        }catch (e) {
            console.log("error ", e)
        }
    }


    async checkSolvency(user_id, course_id){
        try {
            const balance = await transactionService.countUserWallet(user_id)
            const user = await User.findById(user_id)
            const course = await Course.findById(course_id)
            const exe_price = await exeService.getPrice()
            if(course === null || !balance || user === null){//todo: does it work(!balance)?
                throw ApiError.notFound()
            }
            if((balance.exe * exe_price + balance.usdt) >= (course.price + course.price / 10 * exe_price)) {
                return {status: true}
            }

            const price =  (course.price + course.price / 10 * exe_price) - (balance.exe * exe_price + balance.usdt)
            const data = await transactionService.depositShortage(course, user, price, exe_price)
            return {
                status: false,
                data
            }

        }catch (e) {
            console.log("error: ", e)
        }
    }

    async callbackWayforpay(data){
        try{
            console.log(data)
            if (data.transactionStatus === 'Approved') {
                const user = User.findOne({email: data.email})
                if(user===null){
                    throw ApiError.notFound()
                }
                const tokenData = jwt.verify(data.orderReference, process.env.SECRET_ACCESS_KEY)
                let exe_price = tokenData.exe_price

                if(!exe_price){
                    exe_price = await exeService.getPrice()
                }

                const transaction = await Transaction.create({
                    orderReference: data.orderReference,
                    user_id: user._id,
                    exe_price,
                    exe_count: 0,
                    usdt_count: data.amount,
                    kind: "deposit",
                    status: "completed"
                })

                const course_registration = await this.create(tokenData.course_id, tokenData.user_id, exe_price)

                console.log('Платіж успішно здійснений:', data.orderReference);
            } else {

                console.log('Платіж неуспішний:', data.orderReference);
            }
        }catch(e){
            console.log("error: ", e)
        }
    }

}
module.exports = new courseRegistrationService()

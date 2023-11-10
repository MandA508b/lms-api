const Course_registration = require('../models/course_registration.model')
const User = require('../models/user.model')
const Course = require('../models/course.model')
const ApiError = require(`../errors/api.error`)
const courseIterationService = require('./course_iteration.service')
const transactionService = require('./transaction.service')
const exeService = require('./exe.service')
const Transaction = require("../models/transaction.model");
const Deposit_info = require('../models/deposit_info.model')

class courseRegistrationService{


    async create(course_id, user_id, exe_price) {
        try{
            const user = await User.findById(user_id)//checking for the relevance of the user
            const course = await Course.findById(course_id)//checking for the relevance of the course
            if(!exe_price){
                exe_price = await exeService.getPrice()
            }
            if(user === null || course === null || course.is_published === false){
                throw ApiError.notFound('Користувача або курсу не знайдено!')
            }//checked!

            const transaction = await transactionService.buyCourse(user_id, course.price, exe_price)
            if(!transaction){
                throw ApiError.badRequest('недостатньо коштів!')
            }
            const course_iterations = await courseIterationService.actualIteration(course_id)

            if(course_iterations.course_iteration !== null){
                const candidate = await Course_registration.findOne({course_id, user_id, course_iteration_id: course_iterations.course_iteration._id})
                if(candidate!==null){
                    return candidate
                }
                let date = new Date().getTime()
                date = date - date % 86400000
                const days_until_end = (course_iterations.course_iteration.finish_at - date)/86400000
                if(days_until_end >= course.lessons){//registration actual iteration
                    const course_registration = await Course_registration.create({course_id, user_id, course_iteration_id: course_iterations.course_iteration._id, created_at: transaction.created_at})
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
            const course_registration = await Course_registration.create({course_id, user_id, course_iteration_id: course_iterations.next_course_iteration._id, created_at: transaction.created_at})
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
            if(course === null || !balance || user === null){
                throw ApiError.notFound()
            }
            if((balance.exe * exe_price + balance.usdt) >= (course.price + (course.price / 10 * exe_price))) {
                return {status: true}
            }
            let price =  (course.price + (course.price / 10 * exe_price)) - (balance.exe * exe_price + balance.usdt)

            price = Math.max(Math.ceil(price*100)/100, 0.1)

            const data = await transactionService.depositShortage(course, user, price, exe_price)
            return {
                status: false,
                data
            }

        }catch (e) {
            console.log("error: ", e)
        }
    }

    async   callbackWayforpay(data){
        try{
            async function InProcessing(_data){
                const user = User.findOne({email: _data.email})
                if(user===null){
                    throw ApiError.notFound()
                }
                const deposit_info = await Deposit_info.findOne({unique_id: _data.orderReference})

                const transaction = await Transaction.create({
                    orderReference: data.orderReference,
                    merchantSignature: data.merchantSignature,
                    user_id: deposit_info.user_id,
                    exe_price: deposit_info.exe_price,
                    exe_count: 0,
                    usdt_count: data.amount,
                    kind: "deposit",
                    status: "completed"//todo: inprogressing?
                })

                console.log('Платіж розглядається:', _data.orderReference);
            }

            const status = data.transactionStatus
            switch (status){
                case 'Approved':
                    const user = User.findOne({email: data.email})
                    if(user===null){
                        throw ApiError.notFound()
                    }
                    const deposit_info1 = await Deposit_info.findOne({unique_id: data.orderReference})

                    const transaction = await Transaction.create({
                        orderReference: data.orderReference,
                        merchantSignature: data.merchantSignature,
                        user_id: deposit_info1.user_id,
                        exe_price: deposit_info1.exe_price,
                        exe_count: 0,
                        usdt_count: data.amount,
                        kind: "deposit",
                        status: "completed"
                    })

                    const course_registration1 = await this.create(deposit_info1.course_id, deposit_info1.user_id, deposit_info1.exe_price)

                    console.log('Платіж успішно здійснений:', data.orderReference);
                    break;
                case 'InProcessing':
                    await InProcessing(data)
                    const deposit_info2 = await Deposit_info.findOne({unique_id: data.orderReference})
                    const course_registration2 = await this.create(deposit_info2.course_id, deposit_info2.user_id, deposit_info2.exe_price)

                    break;
                case 'Pending':
                    await InProcessing(data)
                    const deposit_info3 = await Deposit_info.findOne({unique_id: data.orderReference})
                    const course_registration3 = await this.create(deposit_info3.course_id, deposit_info3.user_id, deposit_info3.exe_price)

                    break;
                default:
                    console.log('Платіж неуспішний:', data.orderReference);

            }




        }catch(e){
            console.log("error: ", e)
        }
    }

    async checkProgressTransaction(){
        try{
            const transactions = await Transaction.find({status: 'InProgress'})
            for (let key in transactions) {
                const response = await fetch("https://reqbin.com/echo/post/json", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: `{
                       "Id": 78912,
                       "Customer": "Jason Sweet",
                       "Quantity": 1,
                       "Price": 18.00
                      }`,
                });
                response.json().then(data => {
                    console.log(JSON.stringify(data));
                });
                try{
                }catch (e) {
                }
            }
        }catch (e) {
            console.log("error: ", e)
        }
    }
    
}
module.exports = new courseRegistrationService()

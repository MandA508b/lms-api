const Transaction = require('../models/transaction.model')
const User = require('../models/user.model')
const ApiError = require('../errors/api.error')
const CryptoJS = require('crypto-js')
const uuid = require('uuid')
const User_info = require("../models/user_info.model")
const Transaction_info = require("../models/deposit_info.model")
const Course_registration = require("../models/course_registration.model")
const Course_iteration = require("../models/course_iteration.model")
const Course = require("../models/course.model")

class transactionService{

    async   create(user_id, exe_price, exe_count, usdt_count, kind, status){
        try{

            const transaction = await Transaction.create({user_id, exe_price, exe_count, usdt_count, kind, status})
            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async updateStatus(transaction_id, status){
        try{
            const transaction = await Transaction.findByIdAndUpdate(transaction_id, {status})

            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

        async countUserWallet(user_id){
        try{
            const transactions = await Transaction.find({user_id}).sort({created_at: -1})
            let exe = 0,
                usdt = 0

            for(let key in transactions){
                if(transactions[key].status!=='completed')continue;
                exe+=transactions[key].exe_count
                usdt+=transactions[key].usdt_count
            }
            return {exe, usdt}
        }catch(e){
            console.log("error: ", e)
        }
    }

    async depositShortage(course, user, price, exe_price) {
        try {
            const { merchantAccount, merchantDomainName, merchantSecretKey } = process.env;
            const user_info = await User_info.findOne({ user_id: user._id });
            if (user_info === null) {
                throw ApiError.badRequest('Заповінть профіль!');
            }
            const orderDate = Math.floor(Date.now() / 1000); // Поточний час в секундах todo: Date.now()
            const productName = [course.name];
            const productPrice = [price];
            const productCount = [1];
            const clientFirstName = user_info.first_name;
            const clientLastName = user_info.second_name;
            const clientEmail = user.email;
            const clientPhone = user_info.phone_number;
            const language = 'US';

            const generateSignature = (orderReference) => {
                const dataToSign = [
                    merchantAccount,
                    merchantDomainName,
                    orderReference,
                    orderDate,
                    price,
                    'USD', // Змініть на 'USD', якщо ви працюєте з доларами
                    ...productName,
                    ...productCount,
                    ...productPrice,
                ].join(';');
                return CryptoJS.HmacMD5(dataToSign, merchantSecretKey).toString(CryptoJS.enc.Hex);
            };

            const unique_id = uuid.v4();
            const payload = {
                user_id: user._id,
                course_id: course._id,
                exe_price,
                unique_id,
            }
            const transaction_info = await Transaction_info.create({user_id: user._id, course_id: course._id, exe_price, unique_id})
            const orderReference = unique_id

            return {
                paymentSystems:'card',
                merchantAccount,
                merchantDomainName,
                merchantSignature: generateSignature(orderReference),
                orderReference,
                orderDate,
                amount: price,
                currency: 'USD', // Змініть на 'USD', якщо ви працюєте з доларами
                productName,
                productPrice,
                productCount,
                clientFirstName,
                clientLastName,
                clientEmail,
                clientPhone,
                language,
            }
        } catch (e) {
            console.log("Помилка: ", e);
        }
    }
    async buyCourse(user_id, course_price, exe_price) {
        try {
            const balance = await this.countUserWallet(user_id)
            if (balance.usdt - (Math.max(course_price / 10 * exe_price - balance.exe, 0) + course_price) < 0) {
                return false
            }
            if (Math.max(course_price / 10 * exe_price - balance.exe, 0)) {
                const transaction1 = await this.create(user_id, exe_price, Math.max(course_price / 10 * exe_price - balance.exe, 0) / exe_price, -Math.max(course_price / 10 * exe_price - balance.exe, 0), 'swap', 'completed')
            }
            const transaction2 = await this.create(user_id, exe_price, -course_price / 10, 0, 'staking', 'completed')
            const transaction3 = await this.create(user_id, exe_price, 0, -course_price, 'buy course', 'completed')

            return transaction3
        } catch (e) {
            console.log("error: ", e)
        }
    }

    async createWithdrawRequest(user_id, usdt_count, exe_price){
        try{
           const user = await User.findById(user_id)
            if(user===null){
                throw ApiError.notFound("user doesn\'t exist")
            }

            const user_balance = await this.countUserWallet(user_id)

            if(usdt_count<user_balance.usdt){
                throw ApiError.preconditionFailed("insufficient funds")
            }

            const transaction = await this.create(user_id, exe_price, 0, usdt_count, "withdraw", "in progress")

            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findWithdrawRequests(){
        try{
            const checked_transactions = await Transaction.find({kind: "withdraw",$or: [{status: "completed"}, {status: "declined"}]}).sort({created_at: -1})
            const transactions = await Transaction.find({kind: "withdraw", status: "in progress"}).sort({created_at: 1})
            let inprogress_transactions = []
            for(let key in transactions){
                try{
                    const user = await User.findById(transactions[key].user_id)
                    const user_transaction = await Transaction.find({user_id: transactions[key].user_id,status: "completed"}).sort({created_at: 1})
                    let user_history = []
                    let user_balance = {
                        exe_count: 0,
                        usdt_count: 0
                    }
                    for (let u_t_key in user_transaction){

                        user_balance.exe_count += user_transaction[u_t_key].exe_count
                        user_balance.usdt_count += user_transaction[u_t_key].usdt_count

                        if(user_transaction[u_t_key].kind==='payout' || user_transaction[u_t_key].kind==='buy course'){
                            const course_registration = await Course_registration.findOne({user_id: transactions[key].user_id, created_at: user_transaction[u_t_key].created_at})
                            const course_iteration = await Course_iteration.findById(course_registration.course_iteration_id)
                            const course = await Course.findById(course_iteration.course_id)
                            user_history.push({transaction: user_transaction[u_t_key], course_name: course.name, balance: user_balance})
                        }else{
                            user_history.push({transaction: user_transaction[u_t_key], balance: user_balance})
                        }
                    }
                    inprogress_transactions.push({user: user.email, role: user.role, transaction: transactions[key], user_history})
                }catch (e) {console.log(e)}
            }

            return {actual_transaction: inprogress_transactions, history: checked_transactions}
        }catch (e) {
            console.log("error: ", e)
        }
    }


    async acceptWithdrawRequests(transaction_id){
        try{
            const transaction = await Transaction.findById(transaction_id)
            transaction.status = "completed"
            transaction.usdt_count = -transaction.usdt_count
            await transaction.save()

            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async declinedWithdrawRequests(transaction_id){
        try{
            const transaction = await Transaction.findById(transaction_id)
            transaction.status = "declined"
            transaction.usdt_count = -transaction.usdt_count
            await transaction.save()

            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new transactionService()

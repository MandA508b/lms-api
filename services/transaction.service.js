const Transaction = require('../models/transaction.model')
const ApiError = require('../errors/api.error')
const CryptoJS = require('crypto-js')
const uuid = require('uuid')
const jwt = require("jsonwebtoken")
const User_info = require("../models/user_info.model")
const exeService =require('./exe.service')

class transactionService{

    async create(user_id, exe_price, exe_count, usdt_count, kind, status){
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
            const orderDate = Math.floor(Date.now() / 1000); // Поточний час в секундах
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
                    'UAH', // Змініть на 'USD', якщо ви працюєте з доларами
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
            const orderReference = unique_id// || jwt.sign(payload, process.env.SECRET_ACCESS_KEY, { expiresIn: '36500d' });
            return {
                merchantAccount,
                merchantDomainName,
                merchantSignature: generateSignature(orderReference),
                orderReference,
                orderDate,
                amount: price,
                currency: 'UAH', // Змініть на 'USD', якщо ви працюєте з доларами
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
    async buyCourse(user_id, course_price, exe_price){
        try{
            const balance = await this.countUserWallet(user_id)
            if(balance.usdt - (Math.max(course_price/10*exe_price - balance.exe, 0) + course_price) < 0){
                throw ApiError.badRequest("недостатньо коштів!")
                return false
            }
            if(Math.max(course_price/10*exe_price - balance.exe, 0)){
                const transaction1 = await this.create(user_id, exe_price, Math.max(course_price/10*exe_price - balance.exe, 0)/exe_price, -Math.max(course_price/10*exe_price - balance.exe, 0), 'swap', 'completed')
            }
            const transaction2 = await this.create(user_id, exe_price, -course_price/10, 0, 'staking', 'completed')
            const transaction3 = await this.create(user_id, exe_price, 0, -course_price, 'buy course', 'completed')
            return true
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new transactionService()

const Transaction = require('../models/transaction.model')
const Course = require('../models/course.model')
const User = require('../models/user.model')
const exeService = require('./exe.service')
const ApiError = require('../errors/api.error')
const CryptoJS = require('crypto-js')
const uuid = require('uuid')
const jwt = require("jsonwebtoken")
const courseRegistrationService = require('../services/course_registration.service')

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
                exe+=transactions[key].exe
                usdt+=transactions[key].usdt
            }
            return {exe, usdt}
        }catch(e){
            console.log("error: ", e)
        }
    }

    async callbackWayforpay(data){
        try{
            if (data.transactionStatus === 'Approved') {
                const user = User.findOne({email: data.email})
                if(user===null){
                    throw ApiError.notFound()
                }
                const exe_price = await exeService.getPrice()
                const tokenData = jwt.verify(data.orderReference, process.env.SECRET_ACCESS_KEY)
                const transaction = await Transaction.create({
                    orderReference: data.orderReference,
                    user_id: user._id,
                    exe_price,
                    exe_count: 0,
                    usdt_count: data.amount,
                    kind: "deposit",
                    status: "completed"
                })

                const course_registration = await courseRegistrationService.create(tokenData.course_id, tokenData.user_id)

                console.log('Платіж успішно здійснений:', data.orderReference);
            } else {

                console.log('Платіж неуспішний:', data.orderReference);
            }
        }catch(e){
            console.log("error: ", e)
        }
    }

    async depositShortage(course, user, price, exe_price){
        try{
            const {merchantAccount, merchantDomainName, merchantSecretKey} = process.env
            const orderDate = Math.floor(Date.now() / 1000); // Current timestamp in seconds
            const productName = [course.name];
            const productPrice = [price];
            const productCount = [1];
            const clientFirstName = user.first_name;
            const clientLastName = user.second_name;
            const clientEmail = user.email;
            const clientPhone = user.phone_number;
            const language = 'US';

            const generateSignature = (orderReference) => {
                const dataToSign = [
                    merchantAccount,
                    merchantDomainName,
                    orderReference,
                    orderDate,
                    price,
                    'USD',
                    ...productName,
                    ...productCount,
                    ...productPrice,
                ].join(';');

                return CryptoJS.HmacMD5(dataToSign, merchantSecretKey).toString(CryptoJS.enc.Hex);
            };

            const unique_id = uuid.v4()
            const payload = {
                user_id: user._id,
                course_id: course._id,
                exe_price,
                unique_id
            }
            const orderReference = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn: '36500d'})
            const data = {
                merchantAccount,
                merchantDomainName,
                merchantSignature: generateSignature(orderReference),
                orderReference,
                orderDate,
                amount: 1,
                currency: 'USD',
                productName,
                productPrice,
                productCount,
                clientFirstName,
                clientLastName,
                clientEmail,
                clientPhone,
                language,
            }
        }catch(e){
            console.log("error: ", e)
        }
    }

}
module.exports = new transactionService()

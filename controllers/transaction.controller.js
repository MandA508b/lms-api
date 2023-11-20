const ApiError = require(`../errors/api.error`)
const transactionService = require('../services/transaction.service')
const exeService = require('../services/exe.service')

class transactionController{

    async create(req,res,next) {
        try {
            let {user_id, exe_price, exe_count, usdt_count, kind, status} = req.body

            const transaction = await transactionService.create(user_id, exe_price, exe_count, usdt_count, kind, status)

            return res.json(transaction)
        } catch (e) {
            next(e)
        }
    }

    async createWithdrawRequest(req,res,next) {
        try {
            let {user_id, usdt_count, binance_id} = req.body

            if (!user_id || !usdt_count || !binance_id) {
                return next(ApiError.badRequest('missing user_id or usdt_count'))
            }
            const exe_price = await exeService.getPrice()
            const transaction = await transactionService.createWithdrawRequest(user_id, usdt_count, exe_price, binance_id)

            return res.json(transaction)
        } catch (e) {
            next(e)
        }
    }

    async findWithdrawRequests(req,res,next) {
        try {
            const transactions = await transactionService.findWithdrawRequests()

            return res.json(transactions)
        } catch (e) {
            next(e)
        }
    }

    async acceptWithdrawRequests(req,res,next) {
        try {
            const {transaction_id} = req.body

            if (!transaction_id) {
                return next(ApiError.badRequest('missing transaction_id'))
            }

            const transaction = await transactionService.acceptWithdrawRequests(transaction_id)

            return res.json(transaction)
        } catch (e) {
            next(e)
        }
    }

    async declinedWithdrawRequests(req,res,next) {
        try {
            const {transaction_id} = req.body

            if (!transaction_id) {
                return next(ApiError.badRequest('missing transaction_id'))
            }

            const transaction = await transactionService.declinedWithdrawRequests(transaction_id)

            return res.json(transaction)
        } catch (e) {
            next(e)
        }
    }



}

module.exports = new transactionController()
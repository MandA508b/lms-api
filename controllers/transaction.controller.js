const ApiError = require(`../errors/api.error`)
const transactionService = require('../services/transaction.service')

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

}

module.exports = new transactionController()
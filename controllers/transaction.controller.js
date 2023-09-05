const ApiError = require(`../errors/api.error`)
const transactionService = require('../services/transaction.service')

class transactionController{//todo: 

    async create(req,res,next) {
        try {
            let {user_id, usdt, exe, kind} = req.body

            if(!usdt)usdt=0
            if(!exe)exe=0
            if(!user_id || !kind || (!usdt && !exe)) {
                return next(ApiError.badRequest())
            }
            const transaction = await transactionService.create(user_id, usdt, exe, kind)

            return res.json(transaction)
        } catch (e) {
            next(e)
        }
    }

    async callbackWayforpay(req,res,next) {
        try {
            const data = req.body;

            if(!data) {
                return next(ApiError.badRequest())
            }
            await transactionService.callbackWayforpay(data)

            return res.status(200).send('OK');
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new transactionController()
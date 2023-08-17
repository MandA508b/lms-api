const Transaction = require('../models/transaction.model')

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

}
module.exports = new transactionService()

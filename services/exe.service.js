const Transaction = require('../models/transaction.model')
const transactionService = require('./transaction.service')

class exeService{

    async getPrice(){
        try{
            const transactions = await Transaction.find({kind: "deposit"})
            let sum = 0
            for(let key in transactions){
                if(transactions[key].status !== 'completed' || transactions[key].kind !== 'deposit')continue;
                sum+=transactions[key].usdt_count
            }
            return (0.5+Math.floor(sum/1000)*0.001)
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async swap(user_id){
        try{
            const exe_price = await this.getPrice()
            const user_wallet = await transactionService.countUserWallet(user_id)

            const amount = user_wallet.exe

            if(amount === 0){
                throw ApiError.badRequest()
            }

            const usdt_count = amount*exe_price
            const transaction = await transactionService.create(user_id, exe_price, -amount, usdt_count, "swap", "completed" )

            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new exeService()

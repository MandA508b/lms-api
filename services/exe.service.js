const Transaction = require('../models/transaction.model')

class transactionService{

    async getPrice(){
        try{
            const transactions = await Transaction.find({kind: "deposit"})
            let sum = 0
            for(let key in transactions){
                sum+=transactions[key].usdt
            }
            return (0.5+Math.floor(sum/1000)*0.001)
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new transactionService()

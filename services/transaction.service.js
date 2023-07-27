const Transaction = require('../models/transaction.model')
const User_wallet = require('../models/user_wallet.model')

class transactionService{

    async create(user_id, usdt, exe, kind){
        try{
            const transaction = await Transaction.create({user_id, usdt, exe, kind})
            const user_wallet = await User_wallet.findOne({user_id})
            if(kind==="deposit"){
                user_wallet.usdt = user_wallet.usdt + usdt
                user_wallet.exe = user_wallet.exe + exe
            }
            if(kind==="withdraw"){
                user_wallet.usdt = user_wallet.usdt - usdt
                user_wallet.exe = user_wallet.exe - exe
            }
            user_wallet.save()//

            return transaction
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new transactionService()

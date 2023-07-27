const User_wallet = require('../models/user_wallet.model')

class userWalletService{

    async findByUserId(user_id) {
        try{
            return await User_wallet.findOne({user_id})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userWalletService()

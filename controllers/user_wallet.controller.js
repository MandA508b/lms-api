const ApiError = require(`../errors/api.error`)
const userWalletService = require('../services/user_wallet.service')

class userWalletController{

    async findByUserId(req,res,next) {
        try {
            const {user_id} = req.query
            if(!user_id) {
                return next(ApiError.badRequest())
            }
            const user_wallet = await userWalletService.findByUserId(user_id)

            return res.json(user_wallet)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new userWalletController()
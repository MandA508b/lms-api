const ApiError = require(`../errors/api.error`)
const exeService = require('../services/exe.service')

class exeController{

    async getPrice(req,res,next) {
        try {
            const exe_price = await exeService.getPrice()

            return res.json(exe_price)
        } catch (e) {
            next(e)
        }
    }

    async swap(req, res, next){
        try{
            const {user_id} = req.body
            if(!user_id){
                return ApiError.badRequest()
            }
            const transaction = await exeService.swap(user_id)
            
            return res.json(transaction)
        }catch(e){
            next(e)
        }
    }

}

module.exports = new exeController()
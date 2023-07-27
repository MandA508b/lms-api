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

}

module.exports = new exeController()
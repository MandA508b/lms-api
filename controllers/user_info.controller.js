const ApiError = require(`../errors/api.error`)
const userInfoService = require("../services/user_info.service");

class userInfoController{

    async create(req,res,next) {
        try {
            const {user_id, first_name, second_name, phone_number, description} = req.body

            const avatar = req.file
            if(!user_id || !first_name || !second_name || !phone_number || !description || avatar === undefined) {
                return next(ApiError.badRequest())
            }
            const user_info = await userInfoService.create(user_id, first_name, second_name, phone_number, description, avatar)


            return res.json(user_info)
        } catch (e) {
            next(e)
        }
    }

    async update(req,res,next) {
        try {
            const {user_info_id, first_name, second_name, phone_number, description} = req.body

            const avatar = req.file

            if(!user_info_id || !first_name || !second_name || !phone_number || !description || avatar === undefined) {
                return next(ApiError.badRequest())
            }
            const user_info = await userInfoService.update(user_info_id, first_name, second_name, phone_number, description, avatar)


            return res.json(user_info)
        } catch (e) {
            next(e)
        }
    }

    async findByUserId(req,res,next) {
        try {
            const {user_id} = req.query
            if(!user_id) {
                return next(ApiError.badRequest())
            }
            const user_info = await userInfoService.findByUserId(user_id)

            return res.json(user_info)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new userInfoController()
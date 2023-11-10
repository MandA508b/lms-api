const User_info = require('../models/user_info.model')
const ApiError = require(`../errors/api.error`)

class userInfoService{

    async create(user_id, first_name, second_name, phone_number, description) {
        try{
            const candidate = await User_info.findOne({user_id})
            if(candidate){
                return candidate
            }
            const user_info = await User_info.create({user_id, first_name, second_name, phone_number, description})
            return user_info
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async update(user_info_id, first_name, second_name, phone_number, description) {
        try{
            const user_info = await User_info.findByIdAndUpdate(user_info_id, {first_name, second_name, phone_number, description})

            return user_info
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(user_id) {
        try{
            const user_info = await User_info.findOne({user_id})

            return user_info
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userInfoService()

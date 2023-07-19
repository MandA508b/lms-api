const User_info = require('../models/user_info.model')
const ApiError = require(`../errors/api.error`)

class userInfoService{

    async create(user_id, first_name, second_name, phone_number) {
        try{
            const candidate = await User_info.findOne({user_id})
            if(candidate){
                return candidate
            }
            const user_info = await User_info.create({user_id, first_name, second_name, phone_number})
            return user_info
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async update(user_info_id, first_name, second_name, phone_number) {
        try{
            const user_info = await User_info.findByIdAndUpdate(user_info_id, {first_name, second_name, phone_number})

            return user_info
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userInfoService()

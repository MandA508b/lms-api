const User_info = require('../models/user_info.model')
const ApiError = require(`../errors/api.error`)
const s3Service = require('./s3.service')
const crypto = require("crypto");

class userInfoService{

    async create(user_id, first_name, second_name, phone_number, description, avatar) {
        try{
            const candidate = await User_info.findOne({user_id})

            if(candidate){
                const user_info = await User_info.findOne({user_id})
                return await this.update(user_info._id, first_name, second_name, phone_number, description, avatar)
            }

            const expansion = avatar.originalname.split('.')[1]
            let avatar_name = crypto.randomBytes(30).toString('hex') + `.${expansion}`
            await s3Service.upload(avatar, avatar_name, "user-avatar")
            avatar_name = process.env.CDN_URL + 'user-avatar/' + avatar_name

            const user_info = await User_info.create({user_id, first_name, second_name, phone_number, description, avatar: avatar_name})
            return user_info
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async update(user_info_id, first_name, second_name, phone_number, description, avatar) {
        try{
            const user_info = await User_info.findById(user_info_id)

            if(user_info===null){
                throw ApiError.notFound("user info doesn\'t exist")
            }

            const expansion = avatar.originalname.split('.')[1]
            let prev_avatar_name = user_info.avatar.split('/')
            await s3Service.delete(prev_avatar_name[prev_avatar_name.length - 1], "user-avatar")
            let avatar_name = crypto.randomBytes(30).toString('hex') + `.${expansion}`
            await s3Service.upload(avatar, avatar_name, "user-avatar")
            avatar_name = process.env.AWS_BUACKET_URL + 'user-avatar/' + avatar_name

            user_info.first_name = first_name
            user_info.second_name = second_name
            user_info.phone_number = phone_number
            user_info.description = description
            user_info.avatar = avatar_name
            await user_info.save()

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

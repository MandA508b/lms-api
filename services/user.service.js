const User = require('../models/user.model')
const Author_rating = require('../models/author_rating.model')
const Course = require('../models/course.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_winner_payout = require('../models/course_winner_payout.model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const ApiError = require(`../errors/api.error`)
const tokenService = require('../services/token.service')
const mailService = require('../services/mail.service')
const userInfoService = require('../services/user_info.service')
const UserDto = require('../dtos/user.dto')

class userService{
    async findAll() {
        try{
            return await User.find()
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async delete(email) {
        try{
            return await User.findOneAndDelete({email})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async registration(email, password, role){
        try{
            const candidate = await User.findOne({email})
            if(candidate){
                throw ApiError.preconditionFailed('Корситувач з таким email вже зареєстрований!')
            }
            const hashPassword = await bcrypt.hash(password, 3)
            const time = new Date().toISOString()
            const activationLink = uuid.v4()
            const user = await User.create({email, password: hashPassword, time, role, activationLink})
            if(role==='author'){
                const author_rating = await Author_rating.create({user_id: user._id})
            }
            await mailService.sendActivationMail(email, `${process.env.SERVER_URL}/user/activate/${activationLink}`)
            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, userDto.role, userDto.email, tokens.refreshToken)
            const user_info = await userInfoService.create(user._id, ' ', ' ', ' ')
            return ({...tokens, user})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async login(email, password){
        try{
            const user = await User.findOne({email})
            console.log({user})
            if(user === null){
                throw ApiError.notFound('Користувача з таким email не знайдено!')
            }
            let comparePassword = await bcrypt.compare(password, user.password)
            if(!comparePassword){
                throw ApiError.badRequest('Невірний пароль!')
            }
            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, userDto.role, tokens.refreshToken)


            return ({...tokens, user: user})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async refresh(refreshToken){
        try{
            const userData = await tokenService.validateRefreshToken(refreshToken)
            const tokenFromDb = await tokenService.findToken(refreshToken)
            if(tokenFromDb === undefined || userData === undefined){
                throw ApiError.unauthorized("Користувач не авторизований!")
            }
            const id = userData.id
            const user = await User.findOne({id})
            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, userDto.role, tokens.refreshToken)

            return ({accessToken: tokens.accessToken, user: user})
        }catch (e) {
            console.log("error: ",e)
        }
    }

    async logout(refreshToken){
        try{
            const token = await tokenService.removeToken(refreshToken)
            return token
        }catch (e) {
            console.log("error: ")
        }
    }

    async findById(user_id){
        try {
            const user = await User.findById(user_id)
            if(user === undefined){
                throw ApiError.badRequest('Користувача не знайдено!')
            }

            return user
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async activation(activationLink){
        const user = await User.findOneAndUpdate({activationLink}, {isActivated: true})
    }

    async findAllByPayouts(start_at, finish_at){
        const users = await User.find({role: "student"})
        let users_list = []
        for(let u_key in users){
            try{

                let total_payout = {
                    usdt_count: 0,
                    exe_count: 0
                }

                let user_wins = []
                const course_winner_payouts = await Course_winner_payout.find({user_id: users[u_key]._id, created_at: { $gte: start_at, $lte: finish_at }})
                for (let p_key in course_winner_payouts){
                    try{
                        total_payout.usdt_count += course_winner_payouts[p_key].usdt
                        total_payout.exe_count += course_winner_payouts[p_key].exe

                        const course = await Course.findById(course_winner_payouts[p_key].course_id)
                        const course_iteration = await Course_iteration.findById(course_winner_payouts[p_key].course_iteration_id)
                        user_wins.push({
                            course_name: course.name,
                            payout: {
                                usdt_count: course_winner_payouts[p_key].usdt,
                                exe_count: course_winner_payouts[p_key].exe
                            },
                            participants: course_iteration.participants,
                            start_at: course_iteration.start_at,
                            finish_at: course_iteration.finish_at
                        })
                    }catch (e) {}
                }
                users_list.push({
                    user: users[u_key].email,
                    total_payout,
                    user_wins
                })

            }catch (e) {}
        }
        //todo: sort
        return users_list
    }

}
module.exports = new userService()

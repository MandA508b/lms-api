const User = require('../models/user.model')
const bcrypt = require('bcrypt')
// const ApiError = require(`../errors/api.error`)
const tokenService = require('../services/token.service')
const UserDto = require('../dtos/user.dto')

class userService{
    async findAll() {
        try{
            return await User.find()
        }catch (e) {
            console.log("error: ", e)
        }
    }
    async delete(login) {
        try{
            return await User.findOneAndDelete({login})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async registration(login, password, role){
        try{
            const candidate = await User.findOne({login})
            if(candidate){
                // throw ApiError.preconditionFailed('Корситувач з таким login вже зареєстрований!')
            }
            const hashPassword = await bcrypt.hash(password, 3)
            const time = new Date().toISOString()
            const user = await User.create({login, password: hashPassword, time, role})

            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, userDto.role, userDto.login, tokens.refreshToken)

            return ({...tokens, user: user})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async login(login, password){
        try{
            const user = await User.findOne({login})
            if(user === undefined){
                return await this.registration(login, password)
                // throw ApiError.notFound('Користувача з таким login не знайдено!')
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
                // throw ApiError.unauthorized("Користувач не авторизований!")
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

    async findById(userId){
        try {
            const user = await User.findById(userId)
            if(user === undefined){
                // throw ApiError.badRequest('Користувача не знайдено!')
            }

            return user
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async registrationByService(serviceId, login, username, picture){
        try{
            const candidate = await User.findOne({serviceId})
            if(candidate){
                // throw ApiError.preconditionFailed('Корситувач з таким serviceId вже зареєстрований!')
            }
            const time = new Date().toISOString()
            const user = await User.create({serviceId, login, username, picture, time})

            const userDto = new UserDto(user)
            const tokens = await tokenService.generateTokens({...userDto})
            await tokenService.saveToken(userDto.id, userDto.role, tokens.refreshToken)


            return ({...tokens, user: user})
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new userService()

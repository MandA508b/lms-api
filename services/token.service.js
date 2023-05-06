const jwt = require('jsonwebtoken')
const Token = require('../models/token.model')

class tokenService{
    generateTokens(payload){
        try{
            const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS_KEY, {expiresIn: '60m'})
            const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH_KEY, {expiresIn: '7d'})

            return{
                accessToken,
                refreshToken
            }
        }catch (e) {
            console.log("error: ", e)
        }
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.SECRET_ACCESS_KEY)

            return userData
        }catch (e) {
            console.log("error: ", e)
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.SECRET_REFRESH_KEY)

            return userData
        }catch (e) {
            console.log("error: ", e)
            return null
        }
    }

    async saveToken(userId, role, login, refreshToken){
        try{
            const tokenData = await Token.findOne({userId})
            if(tokenData){
                tokenData.refreshToken = refreshToken
                await tokenData.save()

                return tokenData
            }
            const token = await Token.create({userId, role, login, refreshToken})

            return token
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async removeToken(refreshToken){
        try{
            const tokenData = await Token.findOneAndDelete({refreshToken})

            return tokenData
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findToken(refreshToken){
        try{
            const tokenData = await Token.findOne({refreshToken})

            return tokenData
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new tokenService()
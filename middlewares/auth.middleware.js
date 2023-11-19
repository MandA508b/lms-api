const ApiError = require(`../errors/api.error`)
const tokenService = require('../services/token.service')
const userInfoService = require("../services/user_info.service");

module.exports = async (req, res, next) =>{
    if(req.method === 'OPTIONS'){
        next()
    }
    try{
        const token = req.headers.authorization
        if(!token){
            return next(ApiError.unauthorized('Користувач не авторизаваний'))
        }
        const accessToken = token.split(' ')[1]
        if(!accessToken){
            return next(ApiError.unauthorized('Користувач не авторизаваний'))
        }

        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.unauthorized('Користувач не авторизаваний'))
        }

        if(userData.email && userData.isActivated !== true){
            return next(ApiError.forbidden('Користувач не підтвердив пошту'))
        }

        const user_info = await userInfoService.findById(userData.id)
        if(user_info===null){
            return next(ApiError.forbidden('Користувач не заповнив профіль'))
        }

        req.user = userData
        next()
    }catch (e){
        return next(ApiError.internal())
    }
};
const ApiError = require(`../errors/api.error`)
const tokenService = require('../services/token.service')
const userInfoService = require('../services/user_info.service')

module.exports = (req, res, next) =>{
    if(req.method === 'OPTIONS'){
        next()
    }
    try{
        const token = req.headers.authorization
        const accessToken = token.split(' ')[1]
        const userData = tokenService.validateAccessToken(accessToken)
        if(!userData){
            return next(ApiError.unauthorized('Користувач не авторизаваний'))
        }
        if(userData.role !== 'admin'){
            return next(ApiError.forbidden('Користувач не є адміном'))
        }

        req.user = userData
        next()
    }catch (e){
        return next(ApiError.internal())
    }
};
const ApiError = require(`../errors/api.error`)
const userService = require('../services/user.service')
const transactionService = require('../services/transaction.service')

class userController{
    async findAll(req,res,next){
        try{
            const users = await userService.findAll()

            return res.json(users)
        }catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {email} = req.body
            if (!email) {
                return next(ApiError.badRequest())
            }
            const userData = await userService.delete(email)

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async registration(req, res, next){
        try{
            const {email, password, role} = req.body
            if(!password || !email || !role){
                return next(ApiError.badRequest("Не введено логін або пароль!"))
            }
            const userData = await userService.registration(email, password, role)
            if(userData===undefined){
                return next(ApiError.notFound())
            }
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData)
        }catch (e) {
            next(e)
        }
    }
    async login(req, res, next){
        try {
            const {email, password} = req.body
            console.log(email, password)
            if(email === undefined || password === undefined){
                return next(ApiError.badRequest('Не введено логін або пароль!'))
            }
            const userData = await userService.login(email, password)
            if(userData===undefined){
                return next(ApiError.notFound())
            }
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({accessToken: userData.accessToken, user: userData.user})
        }catch (e){
            next(e)
        }
    }
    async refresh(req, res, next){
        try {
            const {refreshToken} = req.cookies
            if(refreshToken === undefined){
                return next(ApiError.badRequest('Користувач не авторизований!'))
            }
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json({accessToken: userData.accessToken, user: userData.user})
        }catch (e) {
            next(e)
        }
    }

    async logout(req, res, next){
        try{
            const {refreshToken} = req.cookies
            const token = userService.logout(refreshToken)
            res.clearCookie('refreshToken')

            return res.json(token)
        }catch (e) {
            next(e)
        }
    }

    async findById(req, res, next){
        try{
            const {user_id} = req.query
            if(user_id === undefined){
                return next(ApiError.badRequest())
            }
            const user = await userService.findById(user_id)

            return res.json(user)
        }catch (e) {
            next(e)
        }
    }

    async activate(req, res, next){
        try{
            const activationLink = req.params.link
            await userService.activation(activationLink)
            
            return res.redirect(process.env.CLIENT_URL)
        }catch (e) {
            next(e)
        }
    }

    async countUserWallet(req, res, next){
        try{
            const {user_id} = req.query
            if(!user_id){
                return next(ApiError.badRequest())
            }
            const user_wallet = await transactionService.countUserWallet(user_id)

            return res.json(user_wallet)
        }catch (e) {
            next(e)
        }
    }
    async findAllByPayouts(req, res, next){
        try{
            let {start_at, finish_at} = req.query

            if(start_at===undefined || finish_at===undefined){
                start_at = 0
                finish_at = Date.now()
            }

            const user_wallet = await userService.findAllByPayouts(start_at, finish_at)

            return res.json(user_wallet)
        }catch (e) {
            next(e)
        }
    }




}

module.exports = new userController()
const ApiError = require(`../errors/api.error`)
const languageService = require('../services/language.service')

class languageController {

    async create(req,res,next) {
        try {
            const {name, url} = req.body
            if(!name || !url){
                return ApiError.badRequest()
            }
            const language = await languageService.create(name, url)

            return res.json(language)
        } catch (e) {
            next(e)
        }
    }

    async findAll(req,res,next) {
        try {
            const languages = await languageService.findAll()

            return res.json(languages)
        } catch (e) {
            next(e)
        }
    }

    async findById(req,res,next) {
        try {
            const {language_id} = req.query
            if(!language_id){
                return ApiError.badRequest()
            }
            const language = await languageService.findById(language_id)

            return res.json(language)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new languageController()
const ApiError = require(`../errors/api.error`)
const courseThemeService = require('../services/course_theme.service')

class courseThemeController{
    async create(req ,res, next) {
        try {
            const {name, color, language} = req.body

            if(!name || !color){
                return next(ApiError.badRequest())
            }
            const course_theme = await courseThemeService.create(name, color, language)

            return res.json(course_theme)
        } catch (e) {
            next(e)
        }
    }

    async findAll(req ,res, next) {
        try {
            const {language} = req.query
            const course_themes = await courseThemeService.findAll(language)

            return res.json(course_themes)
        } catch (e) {
            next(e)
        }
    }

    async delete(req ,res, next) {
        try {
            const {theme_id} = req.query
            if(!theme_id){
                return next(ApiError.badRequest())
            }
            const course_theme = await courseThemeService.delete(theme_id)

            return res.json(course_theme)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new courseThemeController()

const ApiError = require(`../errors/api.error`)
const courseThemeService = require('../services/course_theme.service')

class courseThemeController{
    async create(req ,res, next) {
        try {
            const {name, color} = req.body

            if(!name || !color){
                return next(ApiError.badRequest())
            }
            const course_theme = await courseThemeService.create(name, color)

            return res.json(course_theme)
        } catch (e) {
            next(e)
        }
    }

    async findAll(req ,res, next) {
        try {
            const course_themes = await courseThemeService.findAll()

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

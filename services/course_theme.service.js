const CourseTheme = require('../models/course_theme.model')

class courseThemeService{

    async create(name, color, language) {
        try{
            return  await CourseTheme.create({name, color, language})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(language) {
        try{
            return  await CourseTheme.find({language})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async delete(theme_id) {
        try{
            return  await CourseTheme.findByIdAndDelete(theme_id)
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseThemeService()

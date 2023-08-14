const Language = require('../models/language.model')

class languageService {

    async create(name, url){
        try{
            return await Language.create({name, url})
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findById(language_id){
        try{
            return await Language.findById(language_id)
        }catch (e) {
            console.log("error: ", e)
        }
    }

    async findAll(){
        try{
            return await Language.find()
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new languageService()

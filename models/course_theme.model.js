const db= require('../db/index')

const schema = new db.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    language: {
        type: "String",
        required: true
    }
})

module.exports = db.model('Course_theme', schema)

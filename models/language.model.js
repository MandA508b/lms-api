const db= require('../db/index')

const schema = new db.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = db.model('Language', schema)

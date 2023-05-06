const db = require('../db/index')

const schema = new db.Schema({
    login:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true //student, teacher, admin
    }
});

module.exports = db.model('User', schema)
const db = require('../db/index')

const schema = new db.Schema({
    email:{
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
    email_verified_at: {
        type: Boolean,
        default: false
    },
    usdt_wallet: {
        type: String,
        trim: true//todo: is it necessary?
    },
    role: {
        type: String,
        required: true //student, teacher, admin
    }
});

module.exports = db.model('User', schema)
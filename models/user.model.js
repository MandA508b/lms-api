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
    usdt_wallet: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        required: true //student, teacher, admin
    },
    activationLink: {
        type: String
    },
    isActivated: {
        type: Boolean,
        default: false
    }
});

module.exports = db.model('User', schema)
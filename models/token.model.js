const db= require('../db/index')

const schema = new db.Schema({
    user_id:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    refreshToken:{
        type: String,
        required: true
    }
})

module.exports = db.model('Token', schema)

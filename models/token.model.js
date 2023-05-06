const db= require('../db/index')

const schema = new db.Schema({
    userId:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    login: {
      type: String,
      required: true
    },
    refreshToken:{
        type: String,
        required: true
    }
})

module.exports = db.model('Token', schema)

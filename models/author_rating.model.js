const db= require('../db/index')

const schema = new db.Schema({
    user_id:{
        type: db.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    rating: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    }
})

module.exports = db.model('Author_rating', schema)

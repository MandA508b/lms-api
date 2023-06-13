const db= require('../db/index')

const schema = new db.Schema({
    course_id:{
        type: db.Schema.Types.ObjectId,
        required: true
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

module.exports = db.model('Course_rating', schema)

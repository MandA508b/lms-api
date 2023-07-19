const db= require('../db/index')

const schema = new db.Schema({
    course_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    participants: {
        type: Number,
        default: 0
    },
    start_at: {
        type: Number,
        required: true
    },
    finish_at: {
        type: Number,
        required: true
    }
})

module.exports = db.model('Course_iteration', schema)

const db= require('../db/index')

const schema = new db.Schema({
    course_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    start_at: {
        type: String,
        required: true
    },
    finish_at: {
        type: String,
        required: true
    }
})

module.exports = db.model('Course_iteration', schema)

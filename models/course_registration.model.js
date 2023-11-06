const db= require('../db/index')

const schema = new db.Schema({
    course_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_iteration_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Number,
        required: true
    }
})

module.exports = db.model('Course_registration', schema)

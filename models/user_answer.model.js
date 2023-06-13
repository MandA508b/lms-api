const db = require('../db/index')

const schema = new db.Schema({
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_iteration_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    lesson_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    attempt: {
        type: Number,
        default: 1
    },
    is_correct: {
        type: Boolean,
        required: true
    },
    in_time: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: String,
        required: true
    }
});

module.exports = db.model('User_answer', schema)
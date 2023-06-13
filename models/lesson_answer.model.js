const db= require('../db/index')

const schema = new db.Schema({
    lesson_question_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    right_answer: {
        type: Boolean,
        required: true
    }
})

module.exports = db.model('Lesson_answer', schema)

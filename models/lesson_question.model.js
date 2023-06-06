const db= require('../db/index')

const schema = new db.Schema({
    lesson_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    time_show: {
        type: Number,
        required: true
    }
})

module.exports = db.model('Lesson_question', schema)

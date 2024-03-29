const db= require('../db/index')

const schema = new db.Schema({
    course_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    visibility: {
        type: Boolean,
        default: true
    },
    video_name: {
        type: String,
        required: true
    },
    video_duration:{
      type: Number,
      required: true
    },
    created_at: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    }
})

module.exports = db.model('Lesson', schema)

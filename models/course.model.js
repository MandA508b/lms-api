const db= require('../db/index')

const schema = new db.Schema({
    user_id:{
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
    lessons: {
       type: Number,
       default: 0
    },
    visibility: {
        type: Boolean,
        default: true
    },
    is_published: {
       type: Boolean,
       default: false
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    language_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_theme_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_image: {
        type: String,
        required: true
    }
})

module.exports = db.model('Course', schema)

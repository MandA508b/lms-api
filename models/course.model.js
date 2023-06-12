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
    visibility: {
        type: Boolean,
        default: true
    },
    is_published: {
       type: Boolean,
       default: false
    }
})

module.exports = db.model('Course', schema)

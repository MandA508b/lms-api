const db= require('../db/index')

const schema = new db.Schema({
    user_id:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_id:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    exe_price:{
        type: Number,
        required: true
    },
    unique_id: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Number,
        default: () => new Date().getTime()
    }
})

module.exports = db.model('Deposit_info', schema)

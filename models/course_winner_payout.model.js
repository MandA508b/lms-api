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
    course_iteration_id:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    usdt: {
        type: Number,
        required: true
    },
    exe: {
        type: Number,
        required: true
    },
    created_at: {
        type: Number,
        default: () => new Date().getTime()
    }

})

module.exports = db.model('Course_winner_payout', schema)

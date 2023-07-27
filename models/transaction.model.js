const db= require('../db/index')

const schema = new db.Schema({
    user_id:{
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
    kind: {// 'deposit' or 'withdraw'
        type: String,
        required: true
    }
})

module.exports = db.model('Transaction', schema)

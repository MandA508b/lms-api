const db= require('../db/index')

const schema = new db.Schema({
    orderReference: {
        type: String,
        required: true
    },
    merchantSignature:{
        type: String,
        required: true
    },
    user_id:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    exe_price: {
        type: Number,
        required: true
    },
    exe_count: {
        type: Number,
        required: true
    },
    usdt_count: {
        type: Number,
        required: true
    },
    kind: {// 'deposit', 'withdraw', 'staking' or 'swap'
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    created_at: {
        type: Number,
        default: () => new Date().getTime()
    }

})

module.exports = db.model('Transaction', schema)

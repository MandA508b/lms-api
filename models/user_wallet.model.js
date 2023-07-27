const db = require('../db/index')

const schema = new db.Schema({
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    usdt:{
        type:Number,
        default: 0
    },
    exe:{
        type:Number,
        default: 0
    }
});

module.exports = db.model('User_wallet', schema)
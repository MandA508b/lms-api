const db= require('../db/index')

const schema = new db.Schema({
    user_id:{
        type: db.Schema.Types.ObjectId,
        required: true
    },
    item_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
})

module.exports = db.model('Rating', schema)

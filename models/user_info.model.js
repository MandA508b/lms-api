const db = require('../db/index')

const schema = new db.Schema({
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    first_name:{
        type:String,
        trim: true,
        required: true
    },
    second_name:{
        type: String,
        trim: true,
        required: true
    },
    phone_number: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    avatar: {
        type: String,
        trim: true,
        required: true
    }
});

module.exports = db.model('User_info', schema)
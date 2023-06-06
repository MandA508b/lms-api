const db = require('../db/index')

const schema = new db.Schema({
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    first_name:{
        type:String,
        trim: true
    },
    second_name:{
        type: String,
        trim: true
    },
    phone_number:[//todo: check for serviceability
        {
            countryCode: String,
            phoneNumber: String
        }],

});

module.exports = db.model('User', schema)
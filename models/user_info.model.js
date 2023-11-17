const db = require('../db/index')

const schema = new db.Schema({
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    first_name:{
        type:String,
<<<<<<< HEAD
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
=======
        trim: true
    },
    second_name:{
        type: String,
        trim: true
    },
    phone_number: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
>>>>>>> 6910e5bfc81f0013a9d3d6848479de1dbe129f90
    }
});

module.exports = db.model('User_info', schema)
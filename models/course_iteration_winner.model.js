const db= require('../db/index')

const schema = new db.Schema({
    user_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_iteration_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },
    course_id: {
        type: db.Schema.Types.ObjectId,
        required: true
    },

})

module.exports = db.model('Course_iteration_winner', schema)

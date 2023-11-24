const Course_winner_payout = require('../models/course_winner_payout.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_iteration_winner = require('../models/course_iteration_winner.model')
const exeService = require('./exe.service')
const Transaction = require('../models/transaction.model')

class courseWinnerPayoutsService{

    async calcPayoutsForCourseIteration(course){
        try{
            let date = new Date().getTime()
            date = date - date % 86400000 - 43200000
            const course_iteration = await Course_iteration.findOne({course_id: course._id, finish_at: {$gte: date} , start_at: {$lte: date} })
            console.log({course_iteration, name: course.name})
            if(course_iteration!==null) {
                const course_iteration_winners = await Course_iteration_winner.find({course_iteration_id: course_iteration._id})
                const exe_price = await exeService.getPrice()
                const usdt = (course_iteration.participants*course.price)*0.8/course_iteration_winners.length*0.8,
                    exe = ((course_iteration.participants*course.price)*0.8/course_iteration_winners.length*0.2)/exe_price
                for (let key in course_iteration_winners) {
                    try {
                        const course_winner_payout = await Course_winner_payout.create({usdt, exe, user_id: course_iteration_winners[key].user_id , course_id: course._id, course_iteration_id: course_iteration._id})
                        const transaction = await Transaction.create({user_id: course_iteration_winners[key].user_id, exe_price, exe_count: exe, usdt_count: usdt, kind: "payout", status: "completed"})
                    }catch (e) {
                        console.log("calcPayoutsForCourseIteration error: ", e)
                    }


                }

                await Course_iteration_winner.deleteMany({course_iteration_id: course_iteration._id})
            }
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseWinnerPayoutsService()



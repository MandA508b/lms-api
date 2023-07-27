const Course_winner_payout = require('../models/course_winner_payout.model')
const Course_iteration = require('../models/course_iteration.model')
const Course_iteration_winner = require('../models/course_iteration_winner.model')
const User_wallet = require('../models/user_wallet.model')
const exeService = require('./exe.service')

class courseWinnerPayoutsService{

    async calcPayoutsForCourseIteration(course){
        try{
            let date = new Date().getTime()
            date = date - date % 86400000 - 43200000
            const course_iteration = await Course_iteration.findOne({course_id: course._id, finish_at: {$gte: date} , start_at: {$lte: date} })
            if(course_iteration!==null) {
                const course_iteration_winners = await Course_iteration_winner.find({course_iteration_id: course_iteration._id})
                const exe_price = await exeService.getPrice()
                const usdt = (course_iteration.participants*course.price)*0.8/course_iteration_winners.length*0.8,
                    exe = ((course_iteration.participants*course.price)*0.8/course_iteration_winners.length*0.2)/exe_price
                for (let key in course_iteration_winners) {
                    const course_winner_payout = await Course_winner_payout.create({usdt, exe, user_id: course_iteration_winners[key].user_id , course_id: course._id, course_iteration_id: course_iteration._id})
                    let user_wallet = await User_wallet.findOne({user_id: course_iteration_winners[key].user_id})
                    user_wallet.usdt = user_wallet.usdt + usdt
                    user_wallet.exe = user_wallet.exe + exe
                    user_wallet.save()//todo: async
                }

                Course_iteration_winner.deleteMany({course_iteration_id: course_iteration._id})//todo: async?
            }
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new courseWinnerPayoutsService()



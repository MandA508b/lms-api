const Rating = require('../models/rating.model')
const LessonRating = require('../models/lesson_rating.model')
const CourseRating = require('../models/course_rating.model')
const ApiError = require('../errors/api.error')

class timeService{

    async createLessonRating(user_id, lesson_id, rating){
        try{
            const lesson_rating = await LessonRating.findOne({lesson_id})
            const course_rating = await CourseRating.findOne({course_id: lesson_rating.course_id})

            if(lesson_rating===null || course_rating===null){
                throw ApiError.badRequest()
            }
            const created_rating = await Rating.create({user_id, item_id: lesson_id, rating})
            lesson_rating.rating = (lesson_rating.rating * lesson_rating.votes + rating) / (lesson_rating.votes + 1)
            lesson_rating.votes = lesson_rating.votes + 1
            await lesson_rating.save()

            course_rating.rating = (course_rating.rating * course_rating.votes + rating) / (course_rating.votes + 1)
            course_rating.votes = course_rating.votes + 1
            await course_rating.save()

            return created_rating
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new timeService()

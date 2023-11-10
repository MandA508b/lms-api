const Rating = require('../models/rating.model')
const Lesson_rating = require('../models/lesson_rating.model')
const Course_rating = require('../models/course_rating.model')
const Author_rating = require('../models/author_rating.model')
const ApiError = require('../errors/api.error')

class ratingService{

    async createLessonRating(user_id, lesson_id, rating){
        try{
            const lesson_rating = await Lesson_rating.findOne({lesson_id})
            if(lesson_rating===null){
                throw ApiError.notFound('lesson rating')
            }
            const course_rating = await Course_rating.findOne({course_id: lesson_rating.course_id})

            if(course_rating===null){
                throw ApiError.notFound('course rating')
            }
            
            const author_rating = await Author_rating.findOne({user_id})
            if(author_rating===null){
                throw ApiError.notFound('author rating')
            }
            const created_rating = await Rating.create({user_id, item_id: lesson_id, rating})
            lesson_rating.rating = (lesson_rating.rating * lesson_rating.votes + rating) / (lesson_rating.votes + 1)
            lesson_rating.votes = lesson_rating.votes + 1
            await lesson_rating.save()

            course_rating.rating = (course_rating.rating * course_rating.votes + rating) / (course_rating.votes + 1)
            course_rating.votes = course_rating.votes + 1
            await course_rating.save()

            author_rating.rating = (author_rating.rating * author_rating.votes + rating) / (author_rating.votes + 1)
            author_rating.votes = author_rating.votes + 1
            await author_rating.save()

            return created_rating
        }catch (e) {
            console.log("error: ", e)
        }
    }

}
module.exports = new ratingService()

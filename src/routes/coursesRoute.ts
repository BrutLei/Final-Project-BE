import { verifyUser } from '@/middleware/clerk-authenticate'
import { createCourse, findCourse, getCourses, updateCourse } from '@controllers/courseController'
import express from 'express'

const coursesRoute = express.Router()

coursesRoute
  .get('/get-courses', getCourses)
  .get('/:courseId', findCourse)
  .post('/', verifyUser, createCourse)
  .patch('/:courseId', verifyUser, updateCourse)

export default coursesRoute

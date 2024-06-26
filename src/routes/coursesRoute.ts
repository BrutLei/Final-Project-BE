import { verifyUser } from '@/middleware/clerk-authenticate'
import { createCourse, findCourse, updateCourse } from '@controllers/courseController'
import express from 'express'

const coursesRoute = express.Router()

coursesRoute.post('/', verifyUser, createCourse).get('/:courseId', findCourse).patch('/:courseId', updateCourse)

export default coursesRoute

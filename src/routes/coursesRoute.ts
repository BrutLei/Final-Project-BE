import { createCourse, findCourse, updateCourse } from '@controllers/courseController'
import express from 'express'

const coursesRoute = express.Router()

coursesRoute.post('/', createCourse).get(':/courseId', findCourse).put('/:courseId', updateCourse)

export default coursesRoute

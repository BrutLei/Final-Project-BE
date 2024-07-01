import {
  createCourse,
  findCourse,
  getCoursesList,
  getCourses,
  publishCourse,
  unpublishCourse,
  updateCourse,
  getCourse
} from '@controllers/courseController'

import express from 'express'

const coursesRoute = express.Router()

coursesRoute
  .post('/', createCourse)
  .get('/user/:userId/get-course/:courseId', getCourse)
  .get('/get-list', getCoursesList)
  .get('/get-courses', getCourses)
  .get('/:courseId', findCourse)
  .patch('/:courseId/publish', publishCourse)
  .patch('/:courseId/unpublish', unpublishCourse)
  .patch('/:courseId', updateCourse)

export default coursesRoute

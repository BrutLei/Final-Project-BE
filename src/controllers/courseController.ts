import { db } from '@/utilz/db'
import express from 'express'

export const createCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, title } = req.body
    if (!userId) {
      return res.status(401).send('Unauthorized')
    }
    const course = await db.course.create({ data: { title, userId } })
    return res.status(201).json(course)
  } catch (error) {
    console.log('[CourseController][createCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const findCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params

    const course = await db.course.findUnique({ where: { id: courseId } })
    if (course) {
      return res.status(201).json(course)
    } else {
      return res.status(404).send('Course not found')
    }
  } catch (error) {
    console.log('[CourseController][findCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const updateCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { data, userId } = req.body

    if (!userId) {
      return res.status(401).send('Unaothorized')
    }

    const course = await db.course.update({
      where: { id: courseId, userId: userId },
      data: { ...data }
    })
    return res.status(201).json(course)
  } catch (error) {
    console.log('[CourseController][updateCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

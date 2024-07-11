import { db } from '@/utilz/db'
import { getCoursesByParams } from '@/utilz/get-courses'
import { getProgress } from '@/utilz/get-progress'
import express from 'express'

export const createCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, title } = req.body
    if (!userId) {
      return res.status(401).send('Unauthorized')
    }
    const course = await db.course.create({
      data: {
        title: title,
        userId: userId
      }
    })
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
      return res.status(401).send('Unauthorized')
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

export const getCoursesList = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.body

    const courses = await db.course.findMany({ where: { userId: userId }, orderBy: { createdAt: 'desc' } })

    return res.status(201).json(courses)
  } catch (error) {
    console.log('[CourseController][getCourses][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const publishCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(401).send('Unauthorized')
    }

    const courseOwner = await db.course.findUnique({ where: { id: courseId, userId: userId } })

    if (!courseOwner) {
      return res.status(401).send('Unauthorized')
    }

    const course = await db.course.update({
      where: { id: courseId, userId: userId },
      data: { isPublished: true }
    })
    return res.status(201).json(course)
  } catch (error) {
    console.log('[CourseController][publishCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const unpublishCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(401).send('Unauthorized')
    }

    const courseOwner = await db.course.findUnique({ where: { id: courseId, userId: userId } })

    if (!courseOwner) {
      return res.status(401).send('Unauthorized')
    }

    const course = await db.course.update({
      where: { id: courseId, userId: userId },
      data: { isPublished: false }
    })
    return res.status(201).json(course)
  } catch (error) {
    console.log('[CourseController][unpublishCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const deleteCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(401).send('Unauthorized')
    }

    const courseOwner = await db.course.findUnique({ where: { id: courseId, userId: userId } })

    if (!courseOwner) {
      return res.status(401).send('Unauthorized')
    }

    await db.course.delete({ where: { id: courseId } })
    return res.status(201).send('Course deleted successfully')
  } catch (error) {
    console.log('[CourseController][deleteCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const getCourses = async (req: express.Request, res: express.Response) => {
  try {
    const { title, categoryId } = req.query
    const { userId } = req.params

    const course = await getCoursesByParams({
      userId: userId as string,
      title: title as string,
      categoryId: categoryId as string
    })
    return res.status(201).json(course)
  } catch (error) {
    console.log('[CourseController][getCoursesWithParams][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const getCourse = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, userId } = req.params
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true
      },
      include: {
        chapters: {
          where: {
            isPublished: true
          },
          include: {
            userProgress: { where: { userId: userId } }
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    })
    if (!course) {
      res.redirect('back')
    }

    const progressCount = await getProgress(userId, courseId)

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          courseId: courseId,
          userId: userId
        }
      }
    })

    const isPurchased = !!purchase

    return res.status(201).json({
      ...course,
      isPurchased: isPurchased,
      progressCount: progressCount
    })
  } catch (error) {
    console.log('[CourseController][getCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

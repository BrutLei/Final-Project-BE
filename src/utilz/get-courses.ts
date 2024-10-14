import { Category, Course } from '@prisma/client'
import { getProgress } from './get-progress'
import { db } from '@/utilz/db'
import { log } from 'console'

type CourseWithProgressWithCategory = Course & {
  category: Category | null
  chapters: { id: string }[]
  progress: number | null
}

type GetCourses = {
  userId: string
  title?: string
  categoryId?: string
}

export const getCoursesForDashboard = async (userId: string) => {
  if (!userId) {
    return { completedCourses: [], inProgressCourses: [], coursesWithProgress: [], userId: '' }
  }
  try {
    const purchasedCourses = await db.course.findMany({
      where: {
        isPublished: true,
        purchase: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true
          },
          select: {
            id: true
          }
        },
        purchase: {
          where: {
            userId: userId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      purchasedCourses.map(async (course) => {
        if (course.purchase.length === 0) {
          return {
            ...course,
            progress: null
          }
        }

        const progressPercentage = await getProgress(userId, course.id)
        return {
          ...course,
          progress: progressPercentage
        }
      })
    )

    const completedCourses = coursesWithProgress.filter((course) => course.progress === 100)
    const inProgressCourses = coursesWithProgress.filter((course) => (course.progress ?? 0) < 100)

    return {
      completedCourses,
      inProgressCourses,
      coursesWithProgress,
      userId
    }
  } catch (error) {
    console.log('[utilz][getCourses][error]', error)
    return []
  }
}

export const getCoursesByParams = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title
        },
        categoryId
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true
          },
          select: {
            id: true
          }
        },
        purchase: {
          where: {
            userId: userId
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchase.length === 0) {
          return {
            ...course,
            progress: null
          }
        }

        const progressPercentage = await getProgress(userId, course.id)
        return {
          ...course,
          progress: progressPercentage
        }
      })
    )

    return coursesWithProgress
  } catch (error) {
    console.log('[utilz][getCourses][error]', error)
    return []
  }
}

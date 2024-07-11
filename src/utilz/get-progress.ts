import { db } from './db'

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
  try {
    // get all published chapters of course
    const publishedChapters = await db.chapter.findMany({
      where: { courseId, isPublished: true }
    })

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id)

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId,
        chapterId: { in: publishedChapterIds },
        isCompleted: true
      }
    })

    const progressPercentage = (validCompletedChapters / publishedChapters.length) * 100

    return progressPercentage
  } catch (error) {
    console.log(`utilz/get-progress: Error: ${error}`)
    return 0
  }
}

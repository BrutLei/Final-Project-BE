import { db } from '@/utilz/db'
import express from 'express'

export const createChapter = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { userId, title } = req.body

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: userId }
    })

    if (!courseOwner) {
      return res.status(403).send('Unauthorized')
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId: courseId },
      orderBy: { position: 'desc' }
    })

    const newPositions = lastChapter ? lastChapter.position + 1 : 1

    const chapter = await db.chapter.create({
      data: {
        courseId: courseId,
        title: title,
        position: newPositions
      }
    })

    return res.status(201).json(chapter)
  } catch (error) {
    console.log('[ChapterController][createChapter][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const fetchChapters = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params

    const chapters = await db.chapter.findMany({
      where: { courseId: courseId },
      orderBy: { position: 'asc' }
    })

    return res.status(200).json(chapters)
  } catch (error) {
    console.log('[ChapterController][fetchChapters][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const reorderChapters = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId } = req.params
    const { chapters, userId } = req.body

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: userId }
    })

    if (!courseOwner) {
      return res.status(403).send('Unauthorized')
    }

    const promises = chapters.map(async (chapter: { id: string; position: number }) => {
      return await db.chapter.update({
        where: { id: chapter.id },
        data: {
          position: chapter.position + 1
        }
      })
    })

    await Promise.all(promises)

    return res.status(200).send('Successfully reordered chapters')
  } catch (error) {
    console.log('[ChapterController][reorderChapters][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const fetchChapter = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, chapterId } = req.params

    const chapter = await db.chapter.findFirst({
      where: { courseId: courseId, id: chapterId }
    })

    return res.status(200).json(chapter)
  } catch (error) {
    console.log('[ChapterController][fetchChapter][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const updateChapter = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, chapterId } = req.params
    const { userId, data } = req.body

    if (!userId) {
      return res.status(401).send('Unauthorized')
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: userId }
    })

    if (!courseOwner) {
      return res.status(403).send('Unauthorized')
    }

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: { ...data }
    })

    return res.status(201).json(chapter)
  } catch (error) {
    console.log('[ChapterController][updateChapter][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

export const removeVideo = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, chapterId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(401).send('Unauthorized')
    }

    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId: userId }
    })

    if (!courseOwner) {
      return res.status(403).send('Unauthorized')
    }

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: { videoUrl: null }
    })

    return res.status(201).json(chapter)
  } catch (error) {
    console.log('[ChapterController][removeVideo][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

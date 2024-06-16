import express from 'express'
import { verifyUser } from '@/middleware/clerk-authenticate'
import { createChapter, fetchChapters, reorderChapters } from '@/controllers/chapterController'

const chapterRoute = express.Router()
chapterRoute.get('/:courseId/chapters', verifyUser, fetchChapters)
chapterRoute.post('/:courseId/chapters', createChapter)
chapterRoute.put('/:courseId/chapters/reorder', reorderChapters)

export default chapterRoute

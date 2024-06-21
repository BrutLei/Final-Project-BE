import express from 'express'
import { verifyUser } from '@/middleware/clerk-authenticate'
import {
  createChapter,
  fetchChapter,
  fetchChapters,
  removeVideo,
  reorderChapters,
  updateChapter
} from '@/controllers/chapterController'
import { uploadVideo } from '@/controllers/uploadController'
import { cbUploadVideo } from './uploadRoute'

const chapterRoute = express.Router()
chapterRoute.get('/:courseId/chapters', verifyUser, fetchChapters)
chapterRoute.get('/:courseId/chapters/:chapterId', verifyUser, fetchChapter)
chapterRoute.post('/:courseId/chapters', createChapter)
chapterRoute.put('/:courseId/chapters/reorder', reorderChapters)
chapterRoute.patch('/:courseId/chapters/:chapterId', verifyUser, updateChapter)
chapterRoute.post('/:courseId/chapters/:chapterId/upload-video', cbUploadVideo, uploadVideo)
chapterRoute.put('/:courseId/chapters/:chapterId/remove-video', verifyUser, removeVideo)

export default chapterRoute

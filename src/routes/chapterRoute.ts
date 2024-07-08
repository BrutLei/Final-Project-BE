import express from 'express'
import {
  createChapter,
  fetchChapter,
  fetchChapterVideo,
  fetchChapters,
  publishChapter,
  removeChapter,
  removeVideo,
  reorderChapters,
  unpublishChapter,
  updateChapter
} from '@/controllers/chapterController'
import { uploadVideo } from '@/controllers/uploadController'
import { cbUploadVideo } from './uploadRoute'

const chapterRoute = express.Router()
chapterRoute.get('/:courseId/chapters', fetchChapters)
chapterRoute.get('/:courseId/chapters/:chapterId', fetchChapter)
chapterRoute.get('/:courseId/chapter/:chapterId/user/:userId', fetchChapterVideo)
chapterRoute.post('/:courseId/chapters', createChapter)
chapterRoute.put('/:courseId/chapters/reorder', reorderChapters)
chapterRoute.patch('/:courseId/chapters/:chapterId', updateChapter)
chapterRoute.post('/:courseId/chapters/:chapterId/upload-video', cbUploadVideo, uploadVideo)
chapterRoute.put('/:courseId/chapters/:chapterId/remove-video', removeVideo)
chapterRoute.delete('/:courseId/chapters/:chapterId', removeChapter)
chapterRoute.patch('/:courseId/chapters/:chapterId/publish', publishChapter)
chapterRoute.patch('/:courseId/chapters/:chapterId/unpublish', unpublishChapter)

export default chapterRoute

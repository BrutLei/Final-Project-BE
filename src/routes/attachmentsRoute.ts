import { deleteAttachment, fetchAttachments } from '@/controllers/attachmentController'
import express from 'express'

const attachmentRoute = express.Router()

attachmentRoute.get('/:courseId', fetchAttachments).delete('/:attachmentId', deleteAttachment)

export default attachmentRoute

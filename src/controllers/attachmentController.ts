import { db } from '@/utilz/db'
import express from 'express'
import fs from 'fs'
import path from 'path'
// api url: http://localhost:3000/api/attachments/:courseId (get)
export const fetchAttachments = async (req: express.Request, res: express.Response) => {
  try {
    const courseId = req.params.courseId
    const attachments = await db.attachment.findMany({ where: { courseId }, orderBy: { name: 'asc' } })
    return res.status(200).json(attachments)
  } catch (error) {
    console.log('[AttachmentController][Fetch Attachment][Error]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

// api url: http://localhost:3000/api/attachments/:attachmentId (delete)
// body: { courseId: string }
export const deleteAttachment = async (req: express.Request, res: express.Response) => {
  try {
    const attachmentId = req.params.attachmentId
    const courseId = req.body.courseId
    const attachment = await db.attachment.findUnique({ where: { id: attachmentId, courseId: courseId } })
    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' })
    } else {
      const attachmentPath = attachment.url
      const filepath = path.join(__dirname, `../../${attachmentPath}`)

      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        if (!fs.existsSync(filepath)) {
          try {
            await db.attachment.delete({ where: { id: attachmentId } })
            return res.status(200).send('Attachment deleted')
          } catch (error) {
            console.log('[AttachmentController][deleteAttachment][Error]', error)
            return res.status(500).json({ message: 'Internal Server Error' })
          }
        }
      }
      return res.status(404).json({ message: 'Attachment not found' })
    }
  } catch (error) {
    console.log('[CourseController][deleteAttachment][Error]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

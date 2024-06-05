import { db } from '@/utilz/db'
import express from 'express'
// api url: http://localhost:3000/api/attachments/:courseId
export const fetchAttachments = async (req: express.Request, res: express.Response) => {
  try {
    const courseId = req.params.courseId
    const attachments = await db.attachment.findMany({ where: { courseId }, orderBy: { name: 'asc' } })
    return res.status(200).json(attachments)
  } catch (error) {
    console.log('[CourseController][createCourse][Error]', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

import { db } from '@/utilz/db'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'

const uploadRoute = express.Router()

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/thumbnails')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/videos')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const attachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const path = `uploads/attachments/${req.params['courseId']}`
    fs.mkdirSync(path, { recursive: true })
    return cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const thumbnailUpload = multer({ storage: imageStorage })
const videoUpload = multer({ storage: videoStorage })
const attachmentUpload = multer({ storage: attachmentStorage })

const cbUploadImage = thumbnailUpload.single('thumbnail')
const cbUploadVideo = videoUpload.array('videos')
const cbUploadAttachment = attachmentUpload.array('attachments')

uploadRoute.patch('/:courseId/upload-image', cbUploadImage, async (req: express.Request, res: express.Response) => {
  try {
    const file = req.file
    const courseId = req.params.courseId
    const { userId } = req.body

    if (!courseId) {
      return res.status(400).send('No course id provided')
    } else {
      const course = await db.course.findUnique({ where: { id: courseId } })
      const existImage = course?.imageUrl
      if (existImage) {
        const filepath = path.join(__dirname, `../../${existImage}`)
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        } else {
          console.log('File not found')
        }
      }
    }
    if (!userId) {
      return res.status(401).send('Unauthorized')
    }
    if (!file) {
      return res.status(400).send('No file uploaded')
    }

    const imagePath = req.file?.path

    const course = await db.course.update({
      where: { id: courseId, userId: userId },
      data: { imageUrl: imagePath }
    })
    return res.status(201).json(course)
  } catch (error) {
    console.log('[CourseController][updateCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
})

uploadRoute.post('/upload-video', cbUploadVideo, (req, res) => {
  const files = req.files
  if (files) {
    res.send(files)
  } else {
    res.status(400).send('No file uploaded')
  }
})

uploadRoute.delete('/delete-image/:courseId', async (req: express.Request, res: express.Response) => {
  const courseId = req.params.courseId
  if (!courseId) {
    return res.status(400).send('No course id provided')
  }
  const course = await db.course.findUnique({ where: { id: courseId } })
  const imageUrl = course?.imageUrl
  if (!imageUrl) {
    return res.status(404).send('No image found')
  } else {
    const filepath = path.join(__dirname, `../../${imageUrl}`)
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
      if (!fs.existsSync(filepath)) {
        try {
          await db.course.update({
            where: { id: courseId },
            data: { imageUrl: null }
          })
          return res.status(200).send('File deleted')
        } catch (error) {
          console.log('[CourseController][deleteImage][Error]', error)
          return res.status(500).send('Internal Server Error')
        }
      }
    }
  }
  const filepath = path.join(__dirname, `../../${imageUrl}`)
  if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(err)
        return res.status(500).send('Internal Server Error')
      }
    })
    if (!fs.existsSync(filepath)) {
      return res.status(200).send('File deleted')
    }
  } else {
    return res.status(404).send('File not found')
  }
  return res.status(404).send('File not found')
})

uploadRoute.patch(
  '/:courseId/upload-attachments',
  cbUploadAttachment,
  async (req: express.Request, res: express.Response) => {
    try {
      const courseId = req.params.courseId
      const { userId } = req.body
      const files = req.files

      if (!courseId) {
        return res.status(400).send('No course id provided')
      }
      if (!userId) {
        return res.status(401).send('Unauthorized')
      }
      if (!files) {
        return res.status(400).send('No file uploaded')
      }
      if (files) {
        ;(files as Express.Multer.File[]).forEach(async (file: Express.Multer.File) => {
          try {
            await db.attachment.create({
              data: {
                courseId: courseId,
                name: file.originalname,
                url: file.path
              }
            })
          } catch (error) {
            console.log('[UploadRoute][Error]', error)
            return res.status(500).send('Internal Server Error')
          }
        })
      }
      return res.status(201).send('Attachment uploaded')
    } catch (error) {
      console.log('[CourseController][updateCourse][Error]', error)
      return res.status(500).send('Internal Server Error')
    }
  }
)

uploadRoute.use('/images', express.static(path.join(__dirname, '../..')))

export default uploadRoute

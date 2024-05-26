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

const thumbnailUpload = multer({ storage: imageStorage })
const videoUpload = multer({ storage: videoStorage })

const cbUploadImage = thumbnailUpload.single('thumbnail')
const cbUploadVideo = videoUpload.array('videos')

uploadRoute.patch('/:courseId/upload-image', cbUploadImage, async (req: express.Request, res: express.Response) => {
  try {
    const file = req.file
    const courseId = req.params.courseId
    const { userId } = req.body

    console.log(courseId)

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

uploadRoute.delete('/delete-image', (req: express.Request, res: express.Response) => {
  const imageUrl = req.body.imageUrl
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

// uploadRoute.get('/get-image/:imageUrl', (req: express.Request, res: express.Response) => {
//   const imageUrl = req.params.imageUrl
//   express.static(__dirname + `../../${imageUrl}`)
// })

uploadRoute.use('/images', express.static(path.join(__dirname, '../..')))

export default uploadRoute

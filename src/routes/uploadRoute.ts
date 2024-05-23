import express from 'express'
import fs from 'fs'
import { exists } from 'node:fs'
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

uploadRoute.post('/upload-image', cbUploadImage, (req, res) => {
  const file = req.file
  if (file) {
    res.send(file)
  } else {
    res.status(400).send('No file uploaded')
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

uploadRoute.delete('/delete-image/:filename', (req, res) => {
  console.log('deleting image')
  const filepath = path.join(__dirname, `../../uploads/thumbnails/${req.params.filename}`)
  console.log(filepath)
  // return res.status(200)
  if (fs.existsSync(filepath)) {
    console.log('file exists')
  } else {
    console.log('file does not exist')
  }
})

export default uploadRoute

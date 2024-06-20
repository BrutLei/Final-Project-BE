import fs from 'fs'
import express from 'express'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import path from 'path'

import { db } from '@/utilz/db'

export const uploadVideo = async (req: express.Request, res: express.Response) => {
  try {
    const { courseId, chapterId } = req.params
    const { userId } = req.body

    const file = req.file
    const filePath = req.file?.path
    const fileName = req.file?.filename
    const hlsPath = `uploads/videos/hls/${chapterId}`
    fs.mkdirSync(hlsPath, { recursive: true })

    if (!userId) return res.status(401).send('Unauthorized')

    const chapterOwner = await db.chapter.findUnique({
      where: { id: chapterId, courseId: courseId, course: { userId: userId } }
    })

    if (!chapterOwner) {
      return res.status(403).send('Unauthorized')
    } else {
      const existVideo = chapterOwner.videoUrl

      if (existVideo) {
        const filepath = path.join(__dirname, `../../${hlsPath}`)
        if (fs.existsSync(filepath)) {
          fs.readdirSync(filepath).forEach((file) => {
            fs.unlinkSync(`${filepath}/${file}`)
          })
        }
      }
    }
    if (!file) return res.status(400).send('No file uploaded')

    ffmpeg.setFfmpegPath(ffmpegInstaller.path)

    ffmpeg(filePath, { timeout: 432000 })
      .addOptions([
        '-profile:v baseline', // baseline profile (level 3.0) for H264 video codec
        '-level 3.0',
        '-start_number 0', // start the first .ts segment at index 0
        '-hls_time 10', // 10 second segment duration
        '-hls_list_size 0', // Maxmimum number of playlist entries (0 means all entries/infinite)
        '-f hls' // HLS format
      ])
      .aspectRatio('16:9')
      .output(`${hlsPath}/${fileName}.m3u8`)
      .on('end', async () => {
        try {
          if (fs.existsSync(`${filePath}`)) {
            fs.unlinkSync(`${filePath}`)
          }
          if (fs.existsSync(`${hlsPath}/${fileName}.m3u8`)) {
            const chapter = await db.chapter.update({
              where: { id: chapterId, courseId: courseId },
              data: { videoUrl: `${hlsPath}/${fileName}.m3u8` }
            })
            return res.status(201).json(chapter)
          }
        } catch (error) {
          console.log('[CourseController][uploadVideo][Error]', error)
          return res.status(500).send('Internal Server Error')
        }
      })
      .run()
  } catch (error) {
    console.log('[CourseController][updateCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

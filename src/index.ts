import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from 'process'
import dotenv from 'dotenv'

dotenv.config()

import uploadRoute from './routes/uploadRoute'
import { coursesRoute } from './routes'
import categoriesRoute from './routes/categoriesRoute'
import attachmentRoute from './routes/attachmentsRoute'
import chapterRoute from './routes/chapterRoute'
import webhookRoute from './routes/webhookRoute'
import paymentRoute from './routes/paymentRoute'

const port = process.env.PORT || 3001
const app: Application = express()

app.use(express.static('public'))
app.use(
  cors({
    credentials: true,
    origin: [String(env.ORIGIN), String(env.ORIGIN2), 'http://127.0.0.1:5500', 'http://localhost:5173', '*']
  })
)
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoute)
app.use(express.json())
app.use(cookieParser())
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World</h1>')
})

app.use('/api/courses', uploadRoute)
app.use('/api/courses', coursesRoute)
app.use('/api/courses', chapterRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/attachments', attachmentRoute)
app.use('/api/courses', paymentRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

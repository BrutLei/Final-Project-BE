import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from 'process'

import { ClerkExpressRequireAuth, RequireAuthProp, StrictAuthProp } from '@clerk/clerk-sdk-node'

import uploadRoute from './routes/uploadRoute'
import { coursesRoute } from './routes'
import { verifyUser } from './middleware/clerk-authenticate'
import categoriesRoute from './routes/categoriesRoute'
import attachmentRoute from './routes/attachmentsRoute'
import chapterRoute from './routes/chapterRoute'

const port = process.env.PORT || 3000
const app: Application = express()

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.use(cors({ credentials: true, origin: [String(env.ORIGIN), String(env.ORIGIN2), '*'] }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World</h1>')
})
// app.use(verifyUser)
app.use('/api/courses', uploadRoute)
app.use('/api/courses', coursesRoute)
app.use('/api/courses', chapterRoute)
app.use('/api/categories', categoriesRoute)
app.use('/api/attachments', attachmentRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

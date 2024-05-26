import express, { Express, Request, Response } from 'express'
import uploadRoute from './routes/uploadRoute'
import cors from 'cors'
import { coursesRoute } from './routes'
import cookieParser from 'cookie-parser'
import { env } from 'process'

const app: Express = express()
const port = 3000

app.use(cors({ credentials: true, origin: [String(env.ORIGIN), String(env.ORIGIN2), '*'] }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World</h1>')
})

app.use('/api/courses', uploadRoute)
app.use('/api/courses', coursesRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

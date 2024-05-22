import express, { Express, Request, Response } from 'express'

const app: Express = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello World</h1>')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

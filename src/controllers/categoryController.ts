import { db } from '@/utilz/db'
import express from 'express'

export const fetchCategories = async (req: express.Request, res: express.Response) => {
  try {
    const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
    return res.status(200).json(categories)
  } catch (error) {
    console.log('[CourseController][createCourse][Error]', error)
    return res.status(500).send('Internal Server Error')
  }
}

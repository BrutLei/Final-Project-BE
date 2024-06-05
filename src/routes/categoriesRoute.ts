import express from 'express'
import { verifyUser } from '@/middleware/clerk-authenticate'
import { fetchCategories } from '@/controllers/categoryController'

const categoriesRoute = express.Router()
categoriesRoute.get('/', verifyUser, fetchCategories)

export default categoriesRoute

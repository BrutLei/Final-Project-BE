import express from 'express'
import { fetchCategories } from '@/controllers/categoryController'

const categoriesRoute = express.Router()
categoriesRoute.get('/', fetchCategories)

export default categoriesRoute

import {Router} from 'express'
import { signup, test_routes } from '../controllers/authController'

const authRoutes:Router = Router()

authRoutes.get('/test_routes', test_routes)

authRoutes.post('/signup', signup)

export default authRoutes
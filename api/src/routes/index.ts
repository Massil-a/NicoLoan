import { Router } from 'express'
import authRoutes from './authRoutes'
import clientsRoutes from './clientsRoutes'

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/clients', clientsRoutes)

export default rootRouter
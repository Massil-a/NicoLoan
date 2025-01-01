import { Router } from 'express'
import authRoutes from './authRoutes'
import clientsRoutes from './clientsRoutes'
import loanRoutes from './loanRoutes'

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/clients', clientsRoutes)
rootRouter.use('/loans', loanRoutes)

export default rootRouter
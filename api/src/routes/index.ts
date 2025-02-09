import { Router } from 'express'
import authRoutes from './authRoutes'
import clientsRoutes from './clientsRoutes'
import loanRoutes from './loanRoutes'
import repaymentsRoutes from './repaymentsRoutes'

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/clients', clientsRoutes)
rootRouter.use('/loans', loanRoutes)
rootRouter.use('/repayments', repaymentsRoutes)

export default rootRouter
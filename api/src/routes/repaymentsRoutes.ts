import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware'

import { addRepayment } from '../controllers/repaymentsController'

const loanRoutes: Router = Router()

loanRoutes.post('/add', authMiddleware("1"), addRepayment)

export default loanRoutes
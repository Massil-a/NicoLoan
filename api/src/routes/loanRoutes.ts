import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware'

import { addLoan } from '../controllers/loanController'

const loanRoutes: Router = Router()

loanRoutes.post('/add', authMiddleware("1"), addLoan)

export default loanRoutes
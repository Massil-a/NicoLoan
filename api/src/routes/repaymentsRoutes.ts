import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware'

import { addRepayment, myRepayments } from '../controllers/repaymentsController'

const repaymentsRoutes: Router = Router()

repaymentsRoutes.post('/add', authMiddleware("1"), addRepayment)
repaymentsRoutes.get('/myRepayments', authMiddleware("1"), myRepayments)

// repaymentsRoutes.put('/update', authMiddleware("1"), updateRepayment)
// repaymentsRoutes.delete('/delete', authMiddleware("1"), deleteRepayment)

export default repaymentsRoutes
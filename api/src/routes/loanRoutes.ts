import { Router } from 'express'
import authMiddleware from '../middlewares/authMiddleware'

import { addLoan, getLoansByUserId, getLoansByClientTag, closeLoan, updateLoan, deleteLoan } from '../controllers/loansController'

const loanRoutes: Router = Router()

loanRoutes.post('/add', authMiddleware("1"), addLoan)
loanRoutes.get('/getByUser', authMiddleware("1"), getLoansByUserId)
loanRoutes.get('/getByClientTag/:tagClient', authMiddleware("1"), getLoansByClientTag)
loanRoutes.put('/close', authMiddleware("1"), closeLoan)
loanRoutes.put('/update', authMiddleware("1"), updateLoan)
loanRoutes.delete('/delete', authMiddleware("1"), deleteLoan)

export default loanRoutes
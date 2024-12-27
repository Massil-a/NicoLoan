import { Router } from 'express'
import { addClient, getClientById } from '../controllers/clientsController'
import authMiddleware from '../middlewares/authMiddleware'

const clientsRoutes:Router = Router()

// clientsRoutes.get('/', getOwnClient)
clientsRoutes.post('/add', authMiddleware("1"), addClient)
clientsRoutes.get('/myClients', authMiddleware("1"), getClientById)

export default clientsRoutes
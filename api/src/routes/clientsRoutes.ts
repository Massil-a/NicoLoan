import { Router } from 'express'
import { addClient, getClientsById, getOneClientById } from '../controllers/clientsController'
import authMiddleware from '../middlewares/authMiddleware'

const clientsRoutes: Router = Router()

// clientsRoutes.get('/', getOwnClient)
clientsRoutes.post('/add', authMiddleware("1"), addClient)
clientsRoutes.get('/myClients', authMiddleware("1"), getClientsById)
clientsRoutes.get('/client/:tagClient', authMiddleware("1"), getOneClientById)

export default clientsRoutes
import { Router } from 'express'
import { addClient, deleteClient, getAllTAgs, getClientsById, getOneClientById, updateClient } from '../controllers/clientsController'
import authMiddleware from '../middlewares/authMiddleware'

const clientsRoutes: Router = Router()

// clientsRoutes.get('/', getOwnClient)
clientsRoutes.post('/add', authMiddleware("1"), addClient)

clientsRoutes.get('/myClients', authMiddleware("1"), getClientsById)
clientsRoutes.get('/client/:tagClient', authMiddleware("1"), getOneClientById)
clientsRoutes.get('/getAllTAgs', authMiddleware("1"), getAllTAgs)

clientsRoutes.delete('/delete/:clientTag', authMiddleware("1"), deleteClient)

clientsRoutes.put('/update', authMiddleware("1"), updateClient)

export default clientsRoutes
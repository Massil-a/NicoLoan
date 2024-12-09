import express, {Express, Request, Response, NextFunction} from 'express'
import { PORT } from './secrets'
import rootRouter from './routes';

import { PrismaClient } from '@prisma/client'

const app = express();
app.use(express.json())

app.use('/api', rootRouter);

export const prisma_client = new PrismaClient({
  log:['query']
})

app.listen(PORT, () => {
  console.log("server running port : ", PORT)
})
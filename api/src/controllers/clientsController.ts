import { NextFunction, Request, Response } from 'express'
import { prisma_client } from '..';
import * as jwt from 'jsonwebtoken'
import { HttpException, statusCodes, ErrCodes } from '../utils/exceptions';

export const addClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = req.body
    await prisma_client.$connect();

    let client = await prisma_client.clients.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });

    if (client) {
      return next(new HttpException("Client déjà créé!", ErrCodes.USER_ALREADY_EXISTS, statusCodes.UNAUTHORIZED, null))
    }

    client = await prisma_client.clients.create({
      data : { 
        firstName, 
        lastName,
        email, 
        phone 
      }
    })

    res.status(200).json( { msg: "Client bien créé!" } )
  } catch(e:any) {
    e.status = e.status ?? 707
    next(e)
  } finally {
    await prisma_client.$disconnect();
  }
}
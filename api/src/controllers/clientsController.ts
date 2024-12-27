import { NextFunction, Request, Response } from 'express'
import { prisma_client } from '..';
import { HttpException, statusCodes, ErrCodes } from '../utils/exceptions';

export const addClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, clientTag, email, phone } = req.body

    if (!firstName || !lastName || !clientTag || !email || !phone) {
      return next(new HttpException("Tous les champs sont requis.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null));
    }

    const sanitizedPhone = phone.replace(/\s+/g, '');
    const sanitizedClientTag = (clientTag.replace(/\s+/g, '')).toUpperCase();

    let client = await prisma_client.clients.findFirst({
      where: {
        OR: [
          { clientTag: sanitizedClientTag }
        ]
      }
    });

    if (client) {
      return next(new HttpException("Client déjà créé!", ErrCodes.USER_ALREADY_EXISTS, statusCodes.UNAUTHORIZED, null))
    }

    client = await prisma_client.clients.create({
      data : { 
        userId: req.user.id,
        clientTag: sanitizedClientTag,
        firstName, 
        lastName,
        email, 
        phone: sanitizedPhone
      }
    })

    res.status(200).json( { msg: "Client bien créé!" } )
  } catch(e:any) {
    console.log(e)
    return next(new HttpException("Erreur dans la création d'un client.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const getClientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma_client.clients.findMany({ where : { userId: req.user.id }})
    if(!clients) return next(new HttpException("Aucun client trouvé.", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "Clients bien trouvés.", clients })
  } catch(e:any) {
    console.log(e)
    return next(new HttpException("Erreur dans la récupération des clients.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}
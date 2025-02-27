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
        AND: [
          { clientTag: sanitizedClientTag },
          { userId: req.user.id }
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

export const getClientsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clients = await prisma_client.clients.findMany({ where : { userId: req.user.id }})
    if(!clients) return next(new HttpException("Aucun client trouvé.", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "Clients bien trouvés.", clients })
  } catch(e:any) {
    console.log(e)
    return next(new HttpException("Erreur dans la récupération des clients.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const getOneClientById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tagClient } = req.params
    if(!tagClient) return next(new HttpException("Aucun client fournit.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null))
    const client = await prisma_client.clients.findMany({ 
      where : { 
        AND :
        [
          { userId: req.user.id }, 
          { clientTag: tagClient }
        ] 
      }
    })
    if(!client) return next(new HttpException("Client introuvable.", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "Client bien trouvé.", client })
  } catch(e:any) {
    console.log(e)
    return next(new HttpException("Erreur dans la récupération du client.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const getAllTAgs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma_client.clients.findMany({ where : { userId: req.user.id }, select: { clientTag: true, id: true }})
    if(!tags) return next(new HttpException("Aucun ClientTag trouvé.", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "ClientTags bien trouvés.", tags })
  } catch(e:any) {
    console.log(e)
    return next(new HttpException("Erreur dans la récupération des clientTags.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientTag } = req.params;
    
    // Trouver le client à supprimer
    const clientToDelete = await prisma_client.clients.findFirst({
      where: { AND: [{ clientTag }, { userId: req.user.id }] }
    });
    
    if (!clientToDelete) return next(new HttpException("Client introuvable.", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.NOT_FOUND, null));

    // Supprimer les paiements (Repayments) liés à ce client
    const deletedRepayments = await Promise.all(
      (await prisma_client.loans.findMany({ where: { clientId: clientToDelete.id } }))
        .map(loan => prisma_client.repayments.deleteMany({ where: { loanId: loan.id } }))
    );

    // Supprimer les prêts (Loans) liés à ce client
    const deletedLoans = await prisma_client.loans.deleteMany({ where: { clientId: clientToDelete.id } });

    // Supprimer enfin le client
    const deletedClient = await prisma_client.clients.delete({ where: { id: clientToDelete.id } });

    res.status(200).json({ msg: "Client bien supprimé.", deletedClient, deletedLoans, deletedRepayments });
  } catch (e: any) {
    console.log(e);
    return next(new HttpException("Erreur dans la suppression du client.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null));
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, firstName, lastName, email, phone, clientTag, updatedAt } = req.body;
  
    const record = await prisma_client.clients.update({ 
      where: { id }, 
      data: 
      { 
        firstName,
        lastName,
        email,
        phone,
        clientTag,
        updatedAt,
      } 
      }).catch(() => null);

    if (!record) return next(new HttpException("Client introuvable.", ErrCodes.LOAN_NOT_FOUND, statusCodes.NOT_FOUND, null))
    
    res.status(200).json({ msg: "Client bien modifié." });
  } catch (e: any) {
    console.log(e);
    return next(new HttpException("Erreur dans la modification du client.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null));
  }
};


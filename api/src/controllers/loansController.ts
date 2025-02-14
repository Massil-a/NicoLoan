import { NextFunction, Request, Response } from 'express'
import { prisma_client } from '..';
import { HttpException, statusCodes, ErrCodes } from '../utils/exceptions';
import { toISODateTime } from '../utils/NL_UTILS';

export const addLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loanName, clientTag, totalAmount, durationMonths, monthlyPayment, interestRate, startedAt, dueDate } = req.body
    const userId = req.user.id;

    const client = await prisma_client.clients.findFirst({
      where: {
        AND: [
          { userId },
          { clientTag }
        ]
      }
    })
    if (!client) return next(new HttpException("Client introuvable!", ErrCodes.CLIENT_NOT_FOUND, statusCodes.NOT_FOUND, null));

    await prisma_client.loans.create({
      data: {
        loanName,
        clientId: client.id,
        totalAmount,
        durationMonths,
        monthlyPayment,
        interestRate,
        startedAt: toISODateTime(startedAt),
        dueDate: toISODateTime(dueDate),
        userId
      }
    })
    res.status(200).json({ message: "Prêt \"" + loanName + "\" bien créé!" })
  } catch (e: any) {
    return next(new HttpException("Erreur durant l'ajout d'un prêt", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const getLoansByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const register = await prisma_client.loans.findMany({ 
      where: { userId: req.user.id }, 
      include: { 
        client: { select: { clientTag: true, id: true } }, 
        repayments: { select: { amountPaid: true } }
      } 
    });

    if (!register) {
      return next(new HttpException("Aucun prêt.", ErrCodes.LOAN_NOT_FOUND, statusCodes.NOT_FOUND, null));
    }

    const record = register.map(loan => {
      const totalPaid = loan.repayments.reduce((sum, r) => sum + r.amountPaid, 0);
      const { repayments, ...loanWithoutRepayments } = loan;
      return { ...loanWithoutRepayments, totalPaid };
    });

    res.status(200).json({ msg: "Prêts bien trouvés.", record });
  } catch (e: any) {
    console.log(e);
    return next(new HttpException("Erreur dans la récupération du client.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null));
  }
};

export const getLoansByClientTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tagClient } = req.params;
    if (!tagClient) {
      return next(new HttpException("Aucun client fourni.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null));
    }

    const register = await prisma_client.loans.findMany({
      where: {
        userId: req.user.id,
        client: {
          clientTag: tagClient,
        },
      },
      include: {
        client: true,
        repayments: { select: { amountPaid: true } }
      },
    });

    if (!register) {
      return next(new HttpException("Aucun prêt.", ErrCodes.LOAN_NOT_FOUND, statusCodes.NOT_FOUND, null));
    }

    const record = register.map(loan => {
      const totalPaid = loan.repayments.reduce((sum, r) => sum + r.amountPaid, 0);
      const { repayments, ...loanWithoutRepayments } = loan;
      return { ...loanWithoutRepayments, totalPaid };
    });

    res.status(200).json({ msg: `Prêts concernant ${tagClient} bien trouvés.`, record });
  } catch (e: any) {
    console.log(e);
    return next(new HttpException("Erreur dans la récupération du client.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null));
  }
};

export const closeLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idLoan } = req.body

    if (!idLoan) return next(new HttpException("Aucun prêt annoncé.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null))

    const record = await prisma_client.loans.update({ where: { id: idLoan }, data: { status: 'CLOSED' } }).catch(() => null);
    if (!record) return next(new HttpException("Prêt introuvable.", ErrCodes.LOAN_NOT_FOUND, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "Prêt \"" + record.loanName + "\" bien clôturé.", record })
  } catch (e: any) {
    console.log(e)
    return next(new HttpException("Erreur dans la fermeture d'un prêt.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const updateLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loan } = req.body
    if (!loan) return next(new HttpException("Aucune information passée.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null))

    const record = await prisma_client.loans.update({ 
      where: { id: loan.id }, 
      data: 
      { 
        loanName: loan['Opération'],
        totalAmount: Number(loan['Montant total']),
        durationMonths: loan['Durée totale en mois'],
        status: loan['Statut'],
        createdAt: toISODateTime(loan['Date de création'])
      } 
      }).catch(() => null);
    if (!record) return next(new HttpException("Prêt introuvable.", ErrCodes.LOAN_NOT_FOUND, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "Prêt \"" + record.loanName + "\" bien modifié.", record })
  } catch (e: any) {
    console.log(e)
    return next(new HttpException("Erreur dans la modification d'un prêt.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const deleteLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idLoan } = req.body
    if (!idLoan) return next(new HttpException("Aucun prêt à supprimer.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null))

    await prisma_client.repayments.deleteMany({ where: { loanId: idLoan } });
    const record = await prisma_client.loans.delete({ where: { id: idLoan }}).catch(() => null);      
    if (!record) return next(new HttpException("Prêt introuvable.", ErrCodes.LOAN_NOT_FOUND, statusCodes.NOT_FOUND, null))

    res.status(200).json({ msg: "Prêt \"" + record.loanName + "\" bien supprimé.", record })
  } catch (e: any) {
    console.log(e)
    return next(new HttpException("Erreur dans la suppression d'un prêt.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}
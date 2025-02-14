import { NextFunction, Request, Response } from 'express'
import { prisma_client } from '..';
import { HttpException, statusCodes, ErrCodes } from '../utils/exceptions';
import { hashSync } from 'bcrypt';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await prisma_client.settings.findFirst({ where: { userId: req.user.id } })
    if (!record) return next(new HttpException("Erreur durant l'ajout d'un remboursement", ErrCodes.USER_NOT_FOUND, statusCodes.NOT_FOUND, null))
    res.status(200).json({ msg: "Settings bien trouvés.", record })
  } catch (e: any) {
    return next(new HttpException("Erreur durant la récupération de paramètres.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const setSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password, interestRates, alertLateRepayment, displayInterestRate } = req.body.settings;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return next(new HttpException("First name, last name, and email are required.", ErrCodes.BAD_REQUEST, statusCodes.BAD_REQUEST, null));
    }

    // Update user information
    const newUser = await prisma_client.users.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        email
      }
    }).catch(() => null);

    if (!newUser) {
      return next(new HttpException("Erreur durant la modification de l'utilisateur.", ErrCodes.DATABASE_ERROR, statusCodes.INTERNAL_SERVER_ERROR, null));
    }

    // Update settings
    const newSettings = await prisma_client.settings.update({
      where: { userId: req.user.id },
      data: {
        displayInterestRate: interestRates?.displayInterestRate ?? null,
        interestRateGreen: interestRates?.Green ?? null,
        interestRateOrange: interestRates?.Orange ?? null,
        interestRateRed: interestRates?.Red ?? null,
        alertLateRepayment: alertLateRepayment ?? null
      }
    }).catch( async () => { return null });

    if (!newSettings) {
      await prisma_client.settings.create({
        data: {
          interestRateGreen: interestRates?.Green ?? 0,
          interestRateOrange: interestRates?.Orange ?? 0,
          interestRateRed: interestRates?.Red ?? 0,
          alertLateRepayment: alertLateRepayment ?? false,
          displayInterestRate: displayInterestRate ?? false,
          user: {
            connect: { id: req.user.id }
          }
        }
      })
    }

    // Update password if provided
    if (password && password !== '') {
      const newPwd = await prisma_client.users.update({
        where: { id: req.user.id },
        data: {
          password: hashSync(password, 10)
        }
      }).catch(() => null);

      if (!newPwd) {
        return next(new HttpException("Erreur durant la modification du mot de passe.", ErrCodes.DATABASE_ERROR, statusCodes.INTERNAL_SERVER_ERROR, null));
      }
    }

    res.status(200).json({ msg: "Paramètres bien modifiés.", newUser, newSettings });
  } catch (e: any) {
    console.log(e);
    return next(new HttpException("Erreur dans la modification des paramètres.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null));
  }
};
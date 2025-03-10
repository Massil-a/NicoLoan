import { NextFunction, Request, Response } from 'express'
import { prisma_client } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets';
import { HttpException, statusCodes, ErrCodes } from '../utils/exceptions';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    let user = await prisma_client.users.findFirst({ where: { email } });
    if (user) {
      return next(new HttpException("Utilisateur déjà existant!", ErrCodes.USER_ALREADY_EXISTS, statusCodes.UNAUTHORIZED, null))
    }
    user = await prisma_client.users.create({
      data: {
        firstName,
        lastName,
        email,
        idRole: 1,
        password: hashSync(password, 10),
      }
    })
    res.status(200).json({ user : {
      id : user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      idRole : user.idRole,
      updatedAt : user.updatedAt
    }})
  } catch (e:any) {
    return next(new HttpException("Erreur durant l'inscription", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    let user = await prisma_client.users.findFirst({ where: { email }, include : { settings: true } });
    if (!user) {
      return next(new HttpException("Utilisateur introuvable!", ErrCodes.USER_NOT_FOUND, statusCodes.NOT_FOUND, null));
    }
    if(!compareSync(password, user.password)){
      return next(new HttpException("Mot de passe incorrect!", ErrCodes.INCORRECT_PASSWORD, statusCodes.BAD_REQUEST, null));
    }
    const token = jwt.sign({
      userId : user.id,
      role: user.idRole
    },JWT_SECRET)
    res.json({  user : {
        id : user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        idRole : user.idRole,
        updatedAt : user.updatedAt,
        settings : {
          interestRates: {
            displayInterestRate: user.settings?.displayInterestRate,
            Green: user.settings?.interestRateGreen,
            Orange: user.settings?.interestRateOrange,
            Red: user.settings?.interestRateRed
          },
          alertLateRepayment : user.settings?.alertLateRepayment
        }
      }, 
      token
    })
  } catch (e:any) {
    console.log(e)
    return next(new HttpException("Erreur durant la connexion.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, e ?? null))
  }
}
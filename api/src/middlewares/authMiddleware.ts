import { Request, Response, NextFunction } from 'express'
import { HttpException, ErrCodes, statusCodes } from '../utils/exceptions'
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../secrets'
import { prisma_client } from '..'

// Roles :
// 1 = USER
// 0 = ADMIN
// -1 = BANN

const authMiddleware = (role?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization
        if (!token) {
            return next(new HttpException("Token indisponible", ErrCodes.TOKEN_INVALID, statusCodes.BAD_REQUEST, null))
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET) as any;
            await prisma_client.$connect()
            const user = await prisma_client.users.findFirst({ where: { id: payload.userId } })
            if (!user) {
                return next(new HttpException("Non autorisé!", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.BAD_REQUEST, null))
            }

            console.log("role : ", payload.role)
            if (role && payload.role != role) return next(new HttpException("Non autorisé!", ErrCodes.UNAUTHORIZED_ACCESS, statusCodes.UNAUTHORIZED, null))

            return next()
        } catch (e) {
            console.log(e)
            return next(new HttpException("Erreur dans la vérification d'authentification.", ErrCodes.INTERNAL_SERVER_ERROR, statusCodes.INTERNAL_SERVER_ERROR, null))
        } finally {
            await prisma_client.$disconnect()
        }
    }
}

export default authMiddleware
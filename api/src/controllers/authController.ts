import { Request, Response } from 'express'
import { prisma_client } from '..';
import { hashSync } from 'bcrypt';

export const test_routes = async (req: Request, res: Response) => {
  console.log("controller \"auth.ts\" reached.")
  res.json('Success')
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await prisma_client.$connect();
    let user = await prisma_client.users.findFirst({ where: { email } });
    if (user) {
      // throw Error('Utilisateur déjà existant!')
      res.json({"REPONNNNNNNSEOMGGGG":"deja existant"})
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
    res.json(user)
  } catch (e) {
    console.error(e)
    console.log('_______________________________________________________________________________________________________');
    res.json({ 'err': e })
  }
}
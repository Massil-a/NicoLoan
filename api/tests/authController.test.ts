// Mock Prisma avant les autres imports
jest.mock("../src/index", () => ({
  prisma_client: jest.requireActual("jest-mock-extended").mockDeep(),
}));

import { signup, login } from "../src/controllers/authController";  // Utiliser un chemin relatif correct
import { Request, Response, NextFunction } from "express";
import { mockDeep } from "jest-mock-extended";  // Importation de mockDeep avant d'utiliser jest.mock
import { prisma_client } from "../src/index";  // Importation correcte
import { hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";

// Mocks pour Request, Response et NextFunction
const mockRequest = (body: object) => ({ body } as Request);
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake-jwt-token"),
}));
const mockNext = jest.fn();

describe("AuthController - login", () => {
  it("devrait retourner un token pour un utilisateur valide", async () => {
    const req = mockRequest({ email: "john.doe@example.com", password: "password123" });
    const res = mockResponse();

    // Simule un utilisateur existant avec un mot de passe correct
    (prisma_client.users.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: hashSync("password123", 10),
      idRole: 1,
      updatedAt: new Date(),
      settings: {},
    });

    await login(req, res, mockNext);

    // Vérifie que le token est bien renvoyé
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ token: "fake-jwt-token" })
    );
  });
});

describe("AuthController - login", () => {
  it("devrait retourner un token pour un utilisateur valide", async () => {
    const req = mockRequest({ email: "john.doe@example.com", password: "password123" });
    const res = mockResponse();

    // Simule un utilisateur existant avec un mot de passe correct
    (prisma_client.users.findFirst as jest.Mock).mockResolvedValue({
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: hashSync("password123", 10),
      idRole: 1,
      updatedAt: new Date(),
      settings: {},
    });

    await login(req, res, mockNext);

    // Vérifie que le token est bien renvoyé
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: "fake-jwt-token" }));
  });

  it("devrait retourner une erreur si l'utilisateur n'existe pas", async () => {
    const req = mockRequest({ email: "unknown@example.com", password: "password123" });
    const res = mockResponse();

    // Simule qu'aucun utilisateur n'est trouvé
    (prisma_client.users.findFirst as jest.Mock).mockResolvedValue(null);

    await login(req, res, mockNext);

    // Vérifie que mockNext a été appelé avec l'erreur
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: "Utilisateur introuvable!" }));
  });

  it("devrait retourner une erreur si le mot de passe est incorrect", async () => {
    const req = mockRequest({ email: "john.doe@example.com", password: "wrongpassword" });
    const res = mockResponse();

    // Simule un utilisateur avec un mot de passe incorrect
    (prisma_client.users.findFirst as jest.Mock).mockResolvedValue({
      email: "john.doe@example.com",
      password: hashSync("password123", 10),
    });

    await login(req, res, mockNext);

    // Vérifie que mockNext a été appelé avec l'erreur
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ message: "Mot de passe incorrect!" }));
  });
});
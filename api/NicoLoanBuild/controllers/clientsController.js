"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClient = exports.deleteClient = exports.getAllTAgs = exports.getOneClientById = exports.getClientsById = exports.addClient = void 0;
const __1 = require("..");
const exceptions_1 = require("../utils/exceptions");
const addClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, clientTag, email, phone } = req.body;
        if (!firstName || !lastName || !clientTag || !email || !phone) {
            return next(new exceptions_1.HttpException("Tous les champs sont requis.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        }
        const sanitizedPhone = phone.replace(/\s+/g, '');
        const sanitizedClientTag = (clientTag.replace(/\s+/g, '')).toUpperCase();
        let client = yield __1.prisma_client.clients.findFirst({
            where: {
                AND: [
                    { clientTag: sanitizedClientTag },
                    { userId: req.user.id }
                ]
            }
        });
        if (client) {
            return next(new exceptions_1.HttpException("Client déjà créé!", exceptions_1.ErrCodes.USER_ALREADY_EXISTS, exceptions_1.statusCodes.UNAUTHORIZED, null));
        }
        client = yield __1.prisma_client.clients.create({
            data: {
                userId: req.user.id,
                clientTag: sanitizedClientTag,
                firstName,
                lastName,
                email,
                phone: sanitizedPhone
            }
        });
        res.status(200).json({ msg: "Client bien créé!" });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la création d'un client.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.addClient = addClient;
const getClientsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield __1.prisma_client.clients.findMany({ where: { userId: req.user.id } });
        if (!clients)
            return next(new exceptions_1.HttpException("Aucun client trouvé.", exceptions_1.ErrCodes.UNAUTHORIZED_ACCESS, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Clients bien trouvés.", clients });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la récupération des clients.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.getClientsById = getClientsById;
const getOneClientById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tagClient } = req.params;
        if (!tagClient)
            return next(new exceptions_1.HttpException("Aucun client fournit.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        const client = yield __1.prisma_client.clients.findMany({
            where: {
                AND: [
                    { userId: req.user.id },
                    { clientTag: tagClient }
                ]
            }
        });
        if (!client)
            return next(new exceptions_1.HttpException("Client introuvable.", exceptions_1.ErrCodes.UNAUTHORIZED_ACCESS, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Client bien trouvé.", client });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la récupération du client.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.getOneClientById = getOneClientById;
const getAllTAgs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tags = yield __1.prisma_client.clients.findMany({ where: { userId: req.user.id }, select: { clientTag: true, id: true } });
        if (!tags)
            return next(new exceptions_1.HttpException("Aucun ClientTag trouvé.", exceptions_1.ErrCodes.UNAUTHORIZED_ACCESS, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "ClientTags bien trouvés.", tags });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la récupération des clientTags.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.getAllTAgs = getAllTAgs;
const deleteClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientTag } = req.params;
        // Trouver le client à supprimer
        const clientToDelete = yield __1.prisma_client.clients.findFirst({
            where: { AND: [{ clientTag }, { userId: req.user.id }] }
        });
        if (!clientToDelete)
            return next(new exceptions_1.HttpException("Client introuvable.", exceptions_1.ErrCodes.UNAUTHORIZED_ACCESS, exceptions_1.statusCodes.NOT_FOUND, null));
        // Supprimer les paiements (Repayments) liés à ce client
        const deletedRepayments = yield Promise.all((yield __1.prisma_client.loans.findMany({ where: { clientId: clientToDelete.id } }))
            .map(loan => __1.prisma_client.repayments.deleteMany({ where: { loanId: loan.id } })));
        // Supprimer les prêts (Loans) liés à ce client
        const deletedLoans = yield __1.prisma_client.loans.deleteMany({ where: { clientId: clientToDelete.id } });
        // Supprimer enfin le client
        const deletedClient = yield __1.prisma_client.clients.delete({ where: { id: clientToDelete.id } });
        res.status(200).json({ msg: "Client bien supprimé.", deletedClient, deletedLoans, deletedRepayments });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la suppression du client.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.deleteClient = deleteClient;
const updateClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, firstName, lastName, email, phone, clientTag, updatedAt } = req.body;
        const record = yield __1.prisma_client.clients.update({
            where: { id },
            data: {
                firstName,
                lastName,
                email,
                phone,
                clientTag,
                updatedAt,
            }
        }).catch(() => null);
        if (!record)
            return next(new exceptions_1.HttpException("Client introuvable.", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Client bien modifié." });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la modification du client.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.updateClient = updateClient;
//# sourceMappingURL=clientsController.js.map
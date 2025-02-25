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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLoan = exports.updateLoan = exports.closeLoan = exports.getLoansByClientTag = exports.getLoansByUserId = exports.addLoan = void 0;
const __1 = require("..");
const exceptions_1 = require("../utils/exceptions");
const NL_UTILS_1 = require("../utils/NL_UTILS");
const addLoan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loanName, clientTag, totalAmount, durationMonths, monthlyPayment, interestRate, startedAt, dueDate } = req.body;
        const userId = req.user.id;
        const client = yield __1.prisma_client.clients.findFirst({
            where: {
                AND: [
                    { userId },
                    { clientTag }
                ]
            }
        });
        if (!client)
            return next(new exceptions_1.HttpException("Client introuvable!", exceptions_1.ErrCodes.CLIENT_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        yield __1.prisma_client.loans.create({
            data: {
                loanName,
                clientId: client.id,
                totalAmount,
                durationMonths,
                monthlyPayment,
                interestRate,
                startedAt: (0, NL_UTILS_1.toISODateTime)(startedAt),
                dueDate: (0, NL_UTILS_1.toISODateTime)(dueDate),
                userId
            }
        });
        res.status(200).json({ message: "Prêt \"" + loanName + "\" bien créé!" });
    }
    catch (e) {
        return next(new exceptions_1.HttpException("Erreur durant l'ajout d'un prêt", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.addLoan = addLoan;
const getLoansByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const register = yield __1.prisma_client.loans.findMany({
            where: { userId: req.user.id },
            include: {
                client: { select: { clientTag: true, id: true } },
                repayments: { select: { amountPaid: true } }
            }
        });
        if (!register) {
            return next(new exceptions_1.HttpException("Aucun prêt.", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        }
        const record = register.map(loan => {
            const totalPaid = loan.repayments.reduce((sum, r) => sum + r.amountPaid, 0);
            const { repayments } = loan, loanWithoutRepayments = __rest(loan, ["repayments"]);
            return Object.assign(Object.assign({}, loanWithoutRepayments), { totalPaid });
        });
        res.status(200).json({ msg: "Prêts bien trouvés.", record });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la récupération du client.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.getLoansByUserId = getLoansByUserId;
const getLoansByClientTag = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tagClient } = req.params;
        if (!tagClient) {
            return next(new exceptions_1.HttpException("Aucun client fourni.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        }
        const register = yield __1.prisma_client.loans.findMany({
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
            return next(new exceptions_1.HttpException("Aucun prêt.", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        }
        const record = register.map(loan => {
            const totalPaid = loan.repayments.reduce((sum, r) => sum + r.amountPaid, 0);
            const { repayments } = loan, loanWithoutRepayments = __rest(loan, ["repayments"]);
            return Object.assign(Object.assign({}, loanWithoutRepayments), { totalPaid });
        });
        res.status(200).json({ msg: `Prêts concernant ${tagClient} bien trouvés.`, record });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la récupération du client.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.getLoansByClientTag = getLoansByClientTag;
const closeLoan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idLoan } = req.body;
        if (!idLoan)
            return next(new exceptions_1.HttpException("Aucun prêt annoncé.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        const record = yield __1.prisma_client.loans.update({ where: { id: idLoan }, data: { status: 'CLOSED' } }).catch(() => null);
        if (!record)
            return next(new exceptions_1.HttpException("Prêt introuvable.", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Prêt \"" + record.loanName + "\" bien clôturé.", record });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la fermeture d'un prêt.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.closeLoan = closeLoan;
const updateLoan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loan } = req.body;
        if (!loan)
            return next(new exceptions_1.HttpException("Aucune information passée.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        const record = yield __1.prisma_client.loans.update({
            where: { id: loan.id },
            data: {
                loanName: loan['Opération'],
                totalAmount: Number(loan['Montant total']),
                durationMonths: loan['Durée totale en mois'],
                status: loan['Statut'],
                createdAt: (0, NL_UTILS_1.toISODateTime)(loan['Date de création'])
            }
        }).catch(() => null);
        if (!record)
            return next(new exceptions_1.HttpException("Prêt introuvable.", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Prêt \"" + record.loanName + "\" bien modifié.", record });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la modification d'un prêt.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.updateLoan = updateLoan;
const deleteLoan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idLoan } = req.body;
        if (!idLoan)
            return next(new exceptions_1.HttpException("Aucun prêt à supprimer.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        yield __1.prisma_client.repayments.deleteMany({ where: { loanId: idLoan } });
        const record = yield __1.prisma_client.loans.delete({ where: { id: idLoan } }).catch(() => null);
        if (!record)
            return next(new exceptions_1.HttpException("Prêt introuvable.", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Prêt \"" + record.loanName + "\" bien supprimé.", record });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la suppression d'un prêt.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.deleteLoan = deleteLoan;
//# sourceMappingURL=loansController.js.map
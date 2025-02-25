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
exports.myRepayments = exports.addRepayment = void 0;
const __1 = require("..");
const exceptions_1 = require("../utils/exceptions");
const NL_UTILS_1 = require("../utils/NL_UTILS");
const addRepayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amountPaid, clientTag, loanName, paymentDate } = req.body;
        const userId = req.user.id;
        const client = yield __1.prisma_client.clients.findFirst({ where: { clientTag } });
        if (!client)
            return next(new exceptions_1.HttpException("Client introuvable!", exceptions_1.ErrCodes.CLIENT_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        const loan = yield __1.prisma_client.loans.findFirst({ where: { loanName } });
        if (!loan)
            return next(new exceptions_1.HttpException("Prêt introuvable!", exceptions_1.ErrCodes.LOAN_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        const record = yield __1.prisma_client.repayments.create({
            data: {
                amountPaid,
                loanId: loan.id,
                paymentDate: (0, NL_UTILS_1.toISODateTime)(paymentDate)
            }
        });
        res.status(200).json({ message: "Remboursement du prêt \"" + loanName + "\" bien créé!" });
    }
    catch (e) {
        return next(new exceptions_1.HttpException("Erreur durant l'ajout d'un remboursement", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.addRepayment = addRepayment;
const myRepayments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield __1.prisma_client.repayments.findMany({
            where: {
                loan: {
                    userId: req.user.id
                }
            },
            select: {
                id: true,
                amountPaid: true,
                paymentDate: true,
                loan: {
                    select: {
                        loanName: true,
                        status: true,
                        client: {
                            select: {
                                clientTag: true,
                            }
                        }
                    }
                }
            }
        });
        if (!records)
            return next(new exceptions_1.HttpException("Aucun remboursement trouvé.", exceptions_1.ErrCodes.UNAUTHORIZED_ACCESS, exceptions_1.statusCodes.NOT_FOUND, null));
        res.status(200).json({ msg: "Remboursements bien trouvés.", records });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la récupération des remboursements.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.myRepayments = myRepayments;
//# sourceMappingURL=repaymentsController.js.map
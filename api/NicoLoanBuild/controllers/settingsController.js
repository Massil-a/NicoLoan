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
exports.setSettings = exports.getSettings = void 0;
const __1 = require("..");
const exceptions_1 = require("../utils/exceptions");
const bcrypt_1 = require("bcrypt");
const getSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield __1.prisma_client.settings.findFirst({ where: { userId: req.user.id } });
        if (!record) {
            yield __1.prisma_client.settings.create({
                data: {
                    interestRateGreen: 0,
                    interestRateOrange: 0,
                    interestRateRed: 0,
                    alertLateRepayment: false,
                    displayInterestRate: false,
                    user: {
                        connect: { id: req.user.id }
                    }
                }
            });
        }
        res.status(200).json({ msg: "Settings bien trouvés.", record });
    }
    catch (e) {
        return next(new exceptions_1.HttpException("Erreur durant la récupération de paramètres.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.getSettings = getSettings;
const setSettings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { firstName, lastName, email, password, interestRates, alertLateRepayment, displayInterestRate } = req.body.settings;
        // Validate required fields
        if (!firstName || !lastName || !email) {
            return next(new exceptions_1.HttpException("First name, last name, and email are required.", exceptions_1.ErrCodes.BAD_REQUEST, exceptions_1.statusCodes.BAD_REQUEST, null));
        }
        // Update user information
        const newUser = yield __1.prisma_client.users.update({
            where: { id: req.user.id },
            data: {
                firstName,
                lastName,
                email
            }
        }).catch(() => null);
        if (!newUser) {
            return next(new exceptions_1.HttpException("Erreur durant la modification de l'utilisateur.", exceptions_1.ErrCodes.DATABASE_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, null));
        }
        // Update settings
        const newSettings = yield __1.prisma_client.settings.update({
            where: { userId: req.user.id },
            data: {
                displayInterestRate: (_a = interestRates === null || interestRates === void 0 ? void 0 : interestRates.displayInterestRate) !== null && _a !== void 0 ? _a : null,
                interestRateGreen: (_b = interestRates === null || interestRates === void 0 ? void 0 : interestRates.Green) !== null && _b !== void 0 ? _b : null,
                interestRateOrange: (_c = interestRates === null || interestRates === void 0 ? void 0 : interestRates.Orange) !== null && _c !== void 0 ? _c : null,
                interestRateRed: (_d = interestRates === null || interestRates === void 0 ? void 0 : interestRates.Red) !== null && _d !== void 0 ? _d : null,
                alertLateRepayment: alertLateRepayment !== null && alertLateRepayment !== void 0 ? alertLateRepayment : null
            }
        }).catch(() => __awaiter(void 0, void 0, void 0, function* () { return null; }));
        if (!newSettings) {
            yield __1.prisma_client.settings.create({
                data: {
                    interestRateGreen: (_e = interestRates === null || interestRates === void 0 ? void 0 : interestRates.Green) !== null && _e !== void 0 ? _e : 0,
                    interestRateOrange: (_f = interestRates === null || interestRates === void 0 ? void 0 : interestRates.Orange) !== null && _f !== void 0 ? _f : 0,
                    interestRateRed: (_g = interestRates === null || interestRates === void 0 ? void 0 : interestRates.Red) !== null && _g !== void 0 ? _g : 0,
                    alertLateRepayment: alertLateRepayment !== null && alertLateRepayment !== void 0 ? alertLateRepayment : false,
                    displayInterestRate: displayInterestRate !== null && displayInterestRate !== void 0 ? displayInterestRate : false,
                    user: {
                        connect: { id: req.user.id }
                    }
                }
            });
        }
        // Update password if provided
        if (password && password !== '') {
            const newPwd = yield __1.prisma_client.users.update({
                where: { id: req.user.id },
                data: {
                    password: (0, bcrypt_1.hashSync)(password, 10)
                }
            }).catch(() => null);
            if (!newPwd) {
                return next(new exceptions_1.HttpException("Erreur durant la modification du mot de passe.", exceptions_1.ErrCodes.DATABASE_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, null));
            }
        }
        res.status(200).json({ msg: "Paramètres bien modifiés.", newUser, newSettings });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur dans la modification des paramètres.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.setSettings = setSettings;
//# sourceMappingURL=settingsController.js.map
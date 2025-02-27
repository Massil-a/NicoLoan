"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.login = exports.signup = void 0;
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const exceptions_1 = require("../utils/exceptions");
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        let user = yield __1.prisma_client.users.findFirst({ where: { email } });
        if (user) {
            return next(new exceptions_1.HttpException("Utilisateur déjà existant!", exceptions_1.ErrCodes.USER_ALREADY_EXISTS, exceptions_1.statusCodes.UNAUTHORIZED, null));
        }
        user = yield __1.prisma_client.users.create({
            data: {
                firstName,
                lastName,
                email,
                idRole: 1,
                password: (0, bcrypt_1.hashSync)(password, 10),
            }
        });
        res.status(200).json({ user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                idRole: user.idRole,
                updatedAt: user.updatedAt
            } });
    }
    catch (e) {
        return next(new exceptions_1.HttpException("Erreur durant l'inscription", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        const { email, password } = req.body;
        let user = yield __1.prisma_client.users.findFirst({ where: { email }, include: { settings: true } });
        if (!user) {
            return next(new exceptions_1.HttpException("Utilisateur introuvable!", exceptions_1.ErrCodes.USER_NOT_FOUND, exceptions_1.statusCodes.NOT_FOUND, null));
        }
        if (!(0, bcrypt_1.compareSync)(password, user.password)) {
            return next(new exceptions_1.HttpException("Mot de passe incorrect!", exceptions_1.ErrCodes.INCORRECT_PASSWORD, exceptions_1.statusCodes.BAD_REQUEST, null));
        }
        const token = jwt.sign({
            userId: user.id,
            role: user.idRole
        }, secrets_1.JWT_SECRET);
        res.json({ user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                idRole: user.idRole,
                updatedAt: user.updatedAt,
                settings: {
                    interestRates: {
                        displayInterestRate: (_a = user.settings) === null || _a === void 0 ? void 0 : _a.displayInterestRate,
                        Green: (_b = user.settings) === null || _b === void 0 ? void 0 : _b.interestRateGreen,
                        Orange: (_c = user.settings) === null || _c === void 0 ? void 0 : _c.interestRateOrange,
                        Red: (_d = user.settings) === null || _d === void 0 ? void 0 : _d.interestRateRed
                    },
                    alertLateRepayment: (_e = user.settings) === null || _e === void 0 ? void 0 : _e.alertLateRepayment
                }
            },
            token });
    }
    catch (e) {
        console.log(e);
        return next(new exceptions_1.HttpException("Erreur durant la connexion.", exceptions_1.ErrCodes.INTERNAL_SERVER_ERROR, exceptions_1.statusCodes.INTERNAL_SERVER_ERROR, e !== null && e !== void 0 ? e : null));
    }
});
exports.login = login;
//# sourceMappingURL=authController.js.map
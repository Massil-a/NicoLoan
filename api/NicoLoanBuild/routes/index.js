"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const clientsRoutes_1 = __importDefault(require("./clientsRoutes"));
const loanRoutes_1 = __importDefault(require("./loanRoutes"));
const repaymentsRoutes_1 = __importDefault(require("./repaymentsRoutes"));
const settingsRoutes_1 = __importDefault(require("./settingsRoutes"));
const rootRouter = (0, express_1.Router)();
rootRouter.use('/auth', authRoutes_1.default);
rootRouter.use('/clients', clientsRoutes_1.default);
rootRouter.use('/loans', loanRoutes_1.default);
rootRouter.use('/repayments', repaymentsRoutes_1.default);
rootRouter.use('/settings', settingsRoutes_1.default);
exports.default = rootRouter;
//# sourceMappingURL=index.js.map
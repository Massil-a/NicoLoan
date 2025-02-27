"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const repaymentsController_1 = require("../controllers/repaymentsController");
const loanRoutes = (0, express_1.Router)();
loanRoutes.post('/add', (0, authMiddleware_1.default)("1"), repaymentsController_1.addRepayment);
loanRoutes.get('/myRepayments', (0, authMiddleware_1.default)("1"), repaymentsController_1.myRepayments);
exports.default = loanRoutes;
//# sourceMappingURL=repaymentsRoutes.js.map
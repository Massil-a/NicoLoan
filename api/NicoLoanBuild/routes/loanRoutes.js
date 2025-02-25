"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const loansController_1 = require("../controllers/loansController");
const loanRoutes = (0, express_1.Router)();
loanRoutes.post('/add', (0, authMiddleware_1.default)("1"), loansController_1.addLoan);
loanRoutes.get('/getByUser', (0, authMiddleware_1.default)("1"), loansController_1.getLoansByUserId);
loanRoutes.get('/getByClientTag/:tagClient', (0, authMiddleware_1.default)("1"), loansController_1.getLoansByClientTag);
loanRoutes.put('/close', (0, authMiddleware_1.default)("1"), loansController_1.closeLoan);
loanRoutes.put('/update', (0, authMiddleware_1.default)("1"), loansController_1.updateLoan);
loanRoutes.delete('/delete', (0, authMiddleware_1.default)("1"), loansController_1.deleteLoan);
exports.default = loanRoutes;
//# sourceMappingURL=loanRoutes.js.map
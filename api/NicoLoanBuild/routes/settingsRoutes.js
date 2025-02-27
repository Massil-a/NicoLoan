"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const settingsController_1 = require("../controllers/settingsController");
const loanRoutes = (0, express_1.Router)();
loanRoutes.get('/get', (0, authMiddleware_1.default)("1"), settingsController_1.getSettings);
loanRoutes.post('/set', (0, authMiddleware_1.default)("1"), settingsController_1.setSettings);
exports.default = loanRoutes;
//# sourceMappingURL=settingsRoutes.js.map
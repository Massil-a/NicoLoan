"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/signup', authController_1.signup);
authRoutes.post('/login', authController_1.login);
exports.default = authRoutes;
//# sourceMappingURL=authRoutes.js.map
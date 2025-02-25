"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientsController_1 = require("../controllers/clientsController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const clientsRoutes = (0, express_1.Router)();
// clientsRoutes.get('/', getOwnClient)
clientsRoutes.post('/add', (0, authMiddleware_1.default)("1"), clientsController_1.addClient);
clientsRoutes.get('/myClients', (0, authMiddleware_1.default)("1"), clientsController_1.getClientsById);
clientsRoutes.get('/client/:tagClient', (0, authMiddleware_1.default)("1"), clientsController_1.getOneClientById);
clientsRoutes.get('/getAllTAgs', (0, authMiddleware_1.default)("1"), clientsController_1.getAllTAgs);
clientsRoutes.delete('/delete/:clientTag', (0, authMiddleware_1.default)("1"), clientsController_1.deleteClient);
clientsRoutes.put('/update', (0, authMiddleware_1.default)("1"), clientsController_1.updateClient);
exports.default = clientsRoutes;
//# sourceMappingURL=clientsRoutes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
// router.get('/providers', getProviders as RequestHandler);
router.get('/payment-callback', controller_1.paymentCallback);
router.post('/pay-topup', controller_1.payTopUp);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/register', controller_1.registerUsers);
router.get('/verify-email/:token', controller_1.verifyEmail);
router.post('/login', controller_1.loginUser);
// reset password
router.post('/request-password-reset', controller_1.requestPasswordReset);
router.get('/reset-password/:token', controller_1.resetPassword);
exports.default = router;

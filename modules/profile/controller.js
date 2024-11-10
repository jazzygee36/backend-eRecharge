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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const profileSchema_1 = __importDefault(require("../../model/profileSchema"));
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phoneNumber } = req.body;
    try {
        const existingUser = profileSchema_1.default.findOne({ where: { email } });
        if (!existingUser) {
            return res.status(401).json({ message: 'user not found' });
        }
        const newUser = new profileSchema_1.default({
            username,
            email,
            phoneNumber,
        });
        yield newUser.save();
        return res.status(200).json({ message: newUser });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.getUserProfile = getUserProfile;

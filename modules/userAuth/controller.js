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
exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.verifyEmail = exports.registerUsers = void 0;
const usersSchema_1 = __importDefault(require("../../model/usersSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const registerUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, phoneNumber, password } = req.body;
    // Validate input fields
    if (!username || !email || !phoneNumber || !password) {
        return res.status(400).json({ message: 'All input fields are required' });
    }
    // Check for existing email or phone number
    const existingEmail = yield usersSchema_1.default.findOne({ where: { email } });
    if (existingEmail) {
        return res.status(401).json({ message: 'Email already exists' });
    }
    const existingPhoneNumber = yield usersSchema_1.default.findOne({ where: { phoneNumber } });
    if (existingPhoneNumber) {
        return res.status(401).json({ message: 'Phone number already exists' });
    }
    try {
        // Hash password
        const hashPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user with unverified status
        const user = yield usersSchema_1.default.create({
            username,
            email,
            password: hashPassword,
            phoneNumber,
            isVerified: false, // Track verification status
        });
        // Generate verification token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: '1h', // Consider increasing if needed
        });
        // Set up email transporter
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // your SMTP password
            },
        });
        // Create verification link
        const verificationLink = `http://localhost:8000/api/verify-email/${token}`;
        // Send verification email
        yield transporter.sendMail({
            to: email,
            subject: `e-Recharge Verify Your Email Address`,
            html: `<p>Welcome to eRecharge, ${username}! Please verify your email by clicking the link below:</p>
             <p><a href="${verificationLink}">Verify Email</a></p>`,
        });
        return res
            .status(200)
            .json({ message: 'Verification email sent successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.registerUsers = registerUsers;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield usersSchema_1.default.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isVerified) {
            return res.redirect('https://e-recharge.netlify/login'); // Redirect to login page
        }
        user.isVerified = true;
        yield user.save();
        return res.redirect('https://e-recharge.netlify.app/dashboard'); // Redirect to welcome page
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.verifyEmail = verifyEmail;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(401).json({ message: 'username & password is required' });
    }
    try {
        const user = yield usersSchema_1.default.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'username not found' });
        }
        const comparePwd = yield bcrypt_1.default.compare(password, user.password);
        if (!comparePwd) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, // Payload
        JWT_SECRET, // Secret key from your environment variables
        { expiresIn: '1h' } // Token expiration time
        );
        return res.status(200).json({ message: 'login successful', token });
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }
});
exports.loginUser = loginUser;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        // Find the user by email
        const user = yield usersSchema_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate password reset token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET, {
            expiresIn: '1h', // token expires in 1 hour
        });
        // Set up email transporter
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // your SMTP password
            },
        });
        // Create reset password link
        const resetLink = `http://localhost:8000/reset-password/${token}`;
        // Send reset email
        yield transporter.sendMail({
            to: email,
            subject: 'e-Recharge, Reset Your Password',
            html: `<p>Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>`,
        });
        return res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res
            .status(400)
            .json({ message: 'Token and new password are required' });
    }
    try {
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield usersSchema_1.default.findOne({ where: { id: decoded.id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Hash the new password
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // Update the user's password
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({ message: 'Password reset successful' });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.resetPassword = resetPassword;

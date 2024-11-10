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
exports.paymentCallback = exports.payTopUp = void 0;
const axios_1 = __importDefault(require("axios"));
// Payment Initialization Endpoint
const payTopUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber, amount, utilityType } = req.body;
    try {
        // Initialize Paystack payment with selected utility type
        const paymentResponse = yield initializePaystackPayment(amount, email, phoneNumber, utilityType);
        if (paymentResponse.error)
            return res.status(400).json(paymentResponse);
        // Respond with authorization URL for payment redirection
        res
            .status(200)
            .json({ authorization_url: paymentResponse.data.authorization_url });
    }
    catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ error: 'Payment initialization failed' });
    }
});
exports.payTopUp = payTopUp;
// Function to Initialize Paystack Payment
const initializePaystackPayment = (amount, email, phone, utilityType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post('https://api.paystack.co/transaction/initialize', {
            amount: amount * 100,
            email,
            currency: 'NGN',
            metadata: { utilityType, phoneNumber: phone },
        }, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error initiating Paystack payment:', error);
        return { error: 'Error initiating payment with Paystack' };
    }
});
// Payment Callback for Verification
const paymentCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.query;
    try {
        // Verify transaction status with Paystack
        const paymentVerification = yield verifyPaystackPayment(reference);
        if (paymentVerification.error)
            return res.status(400).json(paymentVerification);
        if (paymentVerification.data.status === 'success') {
            const { utilityType, phoneNumber } = paymentVerification.data.metadata;
            const amount = paymentVerification.data.amount;
            // Process top-up based on utility type
            const topUpResponse = yield topUpAirtimeOrData(amount, phoneNumber, utilityType);
            if (topUpResponse.error)
                return res.status(400).json(topUpResponse);
            res.status(200).json({
                message: 'Payment and utility top-up successful',
                topUpResponse,
            });
        }
        else {
            res.status(400).json({ error: 'Payment failed' });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});
exports.paymentCallback = paymentCallback;
// Verify Paystack Payment Function
const verifyPaystackPayment = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error verifying payment with Paystack:', error);
        return { error: 'Error verifying payment with Paystack' };
    }
});
// Top-up Airtime or Data Based on Utility Type
function topUpAirtimeOrData(amount, phoneNumber, utilityType) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Simulate top-up response
            return {
                success: true,
                message: `Top-up of ${amount} for ${utilityType} successful for ${phoneNumber}`,
            };
        }
        catch (error) {
            console.error('Error in top-up:', error);
            return { error: 'Error processing top-up' };
        }
    });
}

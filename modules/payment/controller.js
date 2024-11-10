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
exports.verifyFunding = void 0;
const axios_1 = __importDefault(require("axios"));
const paymentSchema_1 = __importDefault(require("../../model/paymentSchema"));
const verifyFunding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reference } = req.body;
    if (!reference) {
        return res
            .status(400)
            .json({ error: 'Reference and amount are required.' });
    }
    try {
        // Verify the transaction with Paystack
        const response = yield axios_1.default.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
        });
        if (response.status !== 200) {
            return res.status(500).json({ error: 'Error while verifying payment.' });
        }
        const { status, data } = response.data;
        console.log('dataaaaaa', response.data);
        console.log('dataaaaaa', data.amount, 'amount');
        // Compare the amounts (both are in Kobo)
        if (status === 'success') {
            // Store the amount in Naira by dividing by 100 for readability
            const payment = new paymentSchema_1.default(reference);
            yield payment.save();
            return res
                .status(200)
                .json({ message: 'Payment verified and recorded successfully.' });
        }
        else {
            return res
                .status(400)
                .json({ error: 'Invalid transaction or amount mismatch.' });
        }
    }
    catch (error) {
        console.error('Error verifying payment:', error);
        return res
            .status(500)
            .json({ error: 'An error occurred while verifying payment.' });
    }
});
exports.verifyFunding = verifyFunding;

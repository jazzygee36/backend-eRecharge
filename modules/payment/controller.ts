import axios from 'axios';
import { Request, Response } from 'express';
import UserPayment from '../../model/paymentSchema';
export const verifyFunding = async (req: Request, res: Response) => {
  const { reference, amount } = req.body;

  if (!reference || !amount) {
    return res
      .status(400)
      .json({ error: 'Reference and amount are required.' });
  }

  try {
    // Verify the transaction with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.status !== 200) {
      return res.status(500).json({ error: 'Error while verifying payment.' });
    }

    const { status, data } = response.data;
    console.log('dataaaaaa', response.data);

    // Check if Paystack returned a successful transaction and that the amount matches
    if (status === 'success' && data.amount === amount * 100) {
      // Record the transaction in the database
      const payment = new UserPayment({
        reference,
        amount, // Store in Naira for readability
        status: 'successful',
      });
      await payment.save();

      return res
        .status(200)
        .json({ message: 'Payment verified and recorded successfully.' });
    } else {
      return res
        .status(400)
        .json({ error: 'Invalid transaction or amount mismatch.' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res
      .status(500)
      .json({ error: 'An error occurred while verifying payment.' });
  }
};

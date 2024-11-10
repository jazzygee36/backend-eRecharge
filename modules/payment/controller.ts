import axios from 'axios';
import { Request, Response } from 'express';
import UserPayment from '../../model/paymentSchema';

export const verifyFunding = async (req: Request, res: Response) => {
  const { reference } = req.body;

  if (!reference) {
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
    console.log('dataaaaaa', data.amount, 'amount');

    // Compare the amounts (both are in Kobo)
    if (status === 'success') {
      // Store the amount in Naira by dividing by 100 for readability
      const payment = new UserPayment(reference);

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

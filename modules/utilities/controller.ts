import axios from 'axios';
import { Request, Response } from 'express';

// Payment Initialization Endpoint
export const payTopUp = async (req: Request, res: Response) => {
  const { email, phoneNumber, amount, utilityType } = req.body;

  try {
    // Initialize Paystack payment with selected utility type
    const paymentResponse = await initializePaystackPayment(
      amount,
      email,
      phoneNumber,
      utilityType
    );
    if (paymentResponse.error) return res.status(400).json(paymentResponse);

    // Respond with authorization URL for payment redirection
    res
      .status(200)
      .json({ authorization_url: paymentResponse.data.authorization_url });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Payment initialization failed' });
  }
};

// Function to Initialize Paystack Payment
const initializePaystackPayment = async (
  amount: number,
  email: string,
  phone: string,
  utilityType: string
) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: amount * 100, // Convert to Kobo for Paystack
        email,
        currency: 'NGN',
        metadata: { utilityType, phoneNumber: phone },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error initiating Paystack payment:', error);
    return { error: 'Error initiating payment with Paystack' };
  }
};

// Payment Callback for Verification
export const paymentCallback = async (req: Request, res: Response) => {
  const { reference } = req.query;

  try {
    // Verify transaction status with Paystack
    const paymentVerification = await verifyPaystackPayment(
      reference as string
    );
    if (paymentVerification.error)
      return res.status(400).json(paymentVerification);

    if (paymentVerification.data.status === 'success') {
      const { utilityType, phoneNumber } = paymentVerification.data.metadata;
      const amount = paymentVerification.data.amount;

      // Process top-up based on utility type
      const topUpResponse = await topUpAirtimeOrData(
        amount,
        phoneNumber,
        utilityType
      );
      if (topUpResponse.error) return res.status(400).json(topUpResponse);

      res.status(200).json({
        message: 'Payment and utility top-up successful',
        topUpResponse,
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

// Verify Paystack Payment Function
const verifyPaystackPayment = async (reference: string) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying payment with Paystack:', error);
    return { error: 'Error verifying payment with Paystack' };
  }
};

// Top-up Airtime or Data Based on Utility Type
async function topUpAirtimeOrData(
  amount: number,
  phoneNumber: string,
  utilityType: string
) {
  try {
    // Simulate top-up response
    return {
      success: true,
      message: `Top-up of ${amount} for ${utilityType} successful for ${phoneNumber}`,
    };
  } catch (error) {
    console.error('Error in top-up:', error);
    return { error: 'Error processing top-up' };
  }
}

import { Request, Response } from 'express';
import User from '../../model/usersSchema';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUsers = async (req: Request, res: Response) => {
  const { username, email, phoneNumber, password } = req.body;

  // Validate input fields
  if (!username || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: 'All input fields are required' });
  }

  // Check for existing email or phone number
  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    return res.status(401).json({ message: 'Email already exists' });
  }

  const existingPhoneNumber = await User.findOne({ where: { phoneNumber } });
  if (existingPhoneNumber) {
    return res.status(401).json({ message: 'Phone number already exists' });
  }

  try {
    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user with unverified status
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      phoneNumber,
      isVerified: false, // Track verification status
    });

    // Generate verification token
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: '1h', // Consider increasing if needed
    });

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your SMTP username
        pass: process.env.EMAIL_PASS, // your SMTP password
      },
    });

    // Create verification link
    const verificationLink = `http://localhost:8000/api/verify-email/${token}`;

    // Send verification email
    await transporter.sendMail({
      to: email,
      subject: `e-Recharge Verify Your Email Address`,
      html: `<p>Welcome to eRecharge, ${username}! Please verify your email by clicking the link below:</p>
             <p><a href="${verificationLink}">Verify Email</a></p>`,
    });

    return res
      .status(200)
      .json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.redirect('https://e-recharge.netlify/login'); // Redirect to login page
    }

    user.isVerified = true;
    await user.save();

    return res.redirect('https://e-recharge.netlify.app/dashboard'); // Redirect to welcome page
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'username & password is required' });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'username not found' });
    }
    const comparePwd = await bcrypt.compare(password, user.password);

    if (!comparePwd) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Payload
      JWT_SECRET as string, // Secret key from your environment variables
      { expiresIn: '1h' } // Token expiration time
    );
    return res.status(200).json({ message: 'login successful', token });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate password reset token
    const token = jwt.sign({ id: user.id }, JWT_SECRET as string, {
      expiresIn: '1h', // token expires in 1 hour
    });

    // Set up email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your SMTP username
        pass: process.env.EMAIL_PASS, // your SMTP password
      },
    });

    // Create reset password link
    const resetLink = `http://localhost:8000/reset-password/${token}`;

    // Send reset email
    await transporter.sendMail({
      to: email,
      subject: 'e-Recharge, Reset Your Password',
      html: `<p>Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>`,
    });

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Token and new password are required' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string };
    const user = await User.findOne({ where: { id: decoded.id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

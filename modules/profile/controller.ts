import { Request, Response } from 'express';
import UserProfile from '../../model/profileSchema';

export const getUserProfile = async (req: Request, res: Response) => {
  const { username, email, phoneNumber } = req.body;
  try {
    const existingUser = UserProfile.findOne({ where: { email } });
    if (!existingUser) {
      return res.status(401).json({ message: 'user not found' });
    }

    const newUser = new UserProfile({
      username,
      email,
      phoneNumber,
    });
    await newUser.save();

    return res.status(200).json({ message: newUser });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

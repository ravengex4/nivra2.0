import { Redis } from '@upstash/redis';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../../lib/mongodb';

// Define User Schema (or import from a models file)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'PATIENT', enum: ['PATIENT', 'CARETAKER', 'DOCTOR'] },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reload
const User = mongoose.models.User || mongoose.model('User', UserSchema);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  // Normalize email to match the key used in send-otp
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 1. Retrieve OTP from Redis
    const storedOtp = await redis.get(`otp:${normalizedEmail}`);

    console.log(`[Auth] Verifying ${normalizedEmail}. Stored: ${storedOtp}, Received: ${otp}`);

    // 2. Validate OTP
    // Ensure strict string comparison to handle potential type mismatches (number vs string)
    if (!storedOtp || String(storedOtp) !== String(otp)) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // 3. Delete OTP to prevent reuse
    await redis.del(`otp:${normalizedEmail}`);

    // 4. Connect to DB and Find/Create User
    await connectDB();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({ email: normalizedEmail });
    }

    // 5. Generate JWT
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    return res.status(200).json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
import { Redis } from '@upstash/redis';
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Normalize email to ensure consistency between send and verify
  const normalizedEmail = email.toLowerCase().trim();

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    console.log(`[Auth] Sending OTP to ${normalizedEmail}`);

    // Initialize transporter lazily to prevent top-level crashes
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Store in Redis: Key="otp:user@example.com", Value="123456", Expiry=300s (5 mins)
    await redis.set(`otp:${normalizedEmail}`, otp, { ex: 300 });

    // Send via Email
    await transporter.sendMail({
      from: 'NIVRA <nivra.auth@gmail.com>',
      to: normalizedEmail,
      subject: 'Your Login Verification Code',
      text: `Your verification code is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your verification code is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    });

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send email' });
  }
}
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';


export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, code } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        if (code) {
            // Verification process
            const user = await prisma.verified.findUnique({
                where: { email },
            });

            if (!user || user.verificationCode !== code) {
                return res.status(400).json({ message: 'Invalid code or email' });
            }

            // Mark as verified
            await prisma.verified.update({
                where: { email },
                data: {
                    verified: true,
                    verifiedDate: new Date().toISOString(),
                    verificationCode: null, // Clear the code after use
                },
            });

            return res.status(200).json({ message: 'Email verified successfully' });
        } else {
            // Send verification code
            const verificationCode = crypto.randomBytes(4).toString('hex'); // Generate 8-digit code

            const user = await prisma.verified.upsert({
                where: { email },
                update: {
                    verificationCode,
                    verified: false,
                    verifiedDate: null,
                },
                create: {
                    email,
                    verificationCode,
                    verified: false,
                    verifiedDate: null,
                },
            });

            // TODO: Send the `verificationCode` via email (implement your email-sending logic here)

            return res.status(200).json({ message: 'Verification code sent successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

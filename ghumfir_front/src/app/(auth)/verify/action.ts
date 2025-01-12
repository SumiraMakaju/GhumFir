"use server"

import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service
    auth: {
        user: process.env.EMAIL_USER, // Email address
        pass: process.env.EMAIL_PASS, // Password or app-specific password
    },
});

/**
 * Sends a verification code to the user's email.
 * @param email - The user's email address.
 * @returns A success message or throws an error.
 */
export async function sendVerificationCode(email: string): Promise<string> {
    if (!email) {
        throw new Error('Email is required');
    }

    const verification_code = crypto.randomBytes(4).toString('hex'); // Generate 8-character code

    try {
        // Upsert the user in the database
        const commonData = {
            verification_code,
            verified: false,
            verified_date: null,
        };
        
        await prisma.verified.upsert({
            where: { email },
            update: commonData,
            create: { ...commonData, email },
        });

        console.log('Verification code:', verification_code);
        

        // Send the code via email
        await transporter.sendMail({
            from: `Ghumfir <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${verification_code}`,
            html: `<p>Your verification code is: <strong>${verification_code}</strong></p>`,
        });

        return 'Verification code sent successfully';
    } catch (error) {
        console.error('Error sending verification code:', error);
        throw new Error('Failed to send verification code');
    }
}

/**
 * Verifies the user's email using the provided code.
 * @param email - The user's email address.
 * @param code - The verification code.
 * @returns A success message or throws an error.
 */
export async function verifyEmail(email: string, code: string): Promise<string> {
    if (!email || !code) {
        throw new Error('Email and code are required');
    }

    console.log('Verifying email:', email, code);   

    try {
        // Check if the user and code match
        const user = await prisma.verified.findUnique({
            where: { email },
        });

        console.log('User:', typeof(user.verification_code), user.verification_code);   
        if (!user || user.verification_code !== code) {
            throw new Error('Invalid code or email');
        }

        // Update the user's status to verified
        await prisma.verified.update({
            where: { email },
            data: {
                verified: true,
                verified_date: new Date().toISOString(),
            },
        });

        return 'Email verified successfully';
    } catch (error) {
        console.error('Error verifying email:', error);
        throw new Error('Failed to verify email');
    }
}

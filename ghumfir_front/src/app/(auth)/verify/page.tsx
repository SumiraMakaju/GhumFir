'use client';

import React, { useState } from 'react';
import { sendVerificationCode, verifyEmail } from './action';

export default function VerificationPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        if (!email) {
            setMessage('Please enter a valid email.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await sendVerificationCode(email);
            setMessage(response);
        } catch (error: any) {
            setMessage(error.message || 'Failed to send verification code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!email || !code) {
            setMessage('Please enter both email and verification code.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await verifyEmail(email, code);
            setMessage(response);
        } catch (error: any) {
            setMessage(error.message || 'Failed to verify email.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '2rem' }}>
            <h1>Email Verification</h1>
            <div style={{ marginBottom: '1rem' }}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <button
                    onClick={handleSendCode}
                    type="submit"
                    disabled={isLoading}
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label>Verification Code:</label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the code"
                    style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                />
                <button
                    type="submit"
                    onClick={handleVerify}
                    disabled={isLoading}
                    style={{ width: '100%', padding: '0.5rem' }}
                >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
            </div>
            {message && <p style={{ color: 'blue' }}>{message}</p>}
        </div>
    );
}

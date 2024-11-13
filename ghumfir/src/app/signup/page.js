"use client";
import React, { useState } from 'react';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!email.trim() || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      newErrors.email = 'Invalid email address';
    } else if (!isEmailConfirmed) {
      newErrors.email = 'Email needs to be confirmed';
    }

    if (!password.trim() || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //api check bro
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`/api/check-email?email=${email}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setIsVerificationSent(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Check if email already exists
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          setErrors({ email: 'Email already registered' });
          return;
        }

        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        if (response.ok) {
          setSuccess(true);
        } else {
          const data = await response.json();
          setErrors({ submit: data.message || 'Error creating account' });
        }
      } catch (error) {
        setErrors({ submit: 'Error creating account' });
      }
    }
  };

  const handleVerifyEmail = async () => {
    if (!isVerificationSent) {
      const sent = await sendVerificationCode();
      if (!sent) {
        setErrors({ verificationCode: 'Error sending verification code' });
        return;
      }
    }

    if (!verificationCode) {
      setErrors({ verificationCode: 'Please enter verification code' });
      return;
    }

    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsEmailConfirmed(true);
        setErrors({});
      } else {
        setErrors({ verificationCode: data.message || 'Invalid verification code' });
      }
    } catch (error) {
      setErrors({ verificationCode: 'Error verifying email' });
    }
  };

    ////////here
    
  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Sign Up</h2>
      {success ? (
        <div style={{ 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <p>Signup successful!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.username ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
            {errors.username && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.username}
              </p>
            )}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.email ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
            {errors.email && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
            {!isEmailConfirmed && (
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isVerificationSent ? 'Verify Code' : 'Send Verification Code'}
                </button>
                {isVerificationSent && (
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter verification code"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      marginTop: '0.5rem',
                      border: errors.verificationCode ? '1px solid #dc3545' : '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                )}
                {errors.verificationCode && (
                  <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.verificationCode}
                  </p>
                )}
              </div>
            )}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.password ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
            {errors.password && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>
          {errors.submit && (
            <div style={{ 
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              color: '#721c24',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <p>{errors.submit}</p>
            </div>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </form>
      )}
    </div>
  );
};

export default SignupForm;






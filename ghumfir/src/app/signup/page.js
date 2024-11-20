'use client';

import { useState, useEffect } from 'react';
import styles from './login.module.css';
import Link from 'next/link';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
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

  // Styles
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'white',
  };

  const imageStyle = {
    flex: '0.6',
    background: 'url("/machapuchrevector.jpg") no-repeat center center',
    backgroundSize: 'cover',
    transform: animate ? 'translateX(0)' : 'translateX(100%)', 
    opacity: animate ? 1 : 0,
    animation: animate ? 'slideInRight 1s ease-out' : 'none', 
    borderTopLeftRadius: '50px', 
    borderBottomLeftRadius: '50px', 
    transition: 'transform 1.5s ease-out, opacity 2s ease-out',
    position: 'relative',
  };

  const leftSideStyle = { 
    flex: '0.4',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const formBoxStyle = {
    width: '800px',
    backgroundColor: 'rgba(222, 244, 244, 0.7)',
    color: '#333',
    padding: '60px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transform: animate ? 'scale(1)' : 'scale(0.8)',
    opacity: animate ? 1 : 0,
    animation: animate ? 'shake 0.5s ease-out, scaleIn 1s ease-out' : 'none',
    position: 'relative',
    zIndex: '2',
  };
  
  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '10px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: '500',
  };

  const buttonStyle = {
    backgroundColor: '#0ea5e9',
    color: 'white',
    padding: '12px 25px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    width: 'fit-content',
  };

  const iconStyle = {
    position: 'absolute',
    fontSize: '24px',
    color: '#0ea5e9',
    opacity: '0.7',
    animation: 'float 3s ease-in-out infinite',
    zIndex: '1',
  };

  return (
    <div style={containerStyle}>
      <div style={leftSideStyle}>
        <div style={formBoxStyle}>
          <h1 style={{ color: '#333', fontSize: '28px', fontWeight: 'bold', marginBottom: '0' }}>
            Join the Adventure!
          </h1>
          <p style={{ color: '#666', marginTop: '5px', marginBottom: '20px' }}>
            Create your account to start exploring
          </p>

          {success ? (
            <div style={{ 
              backgroundColor: '#d4edda', 
              border: '1px solid #c3e6cb',
              color: '#155724',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <p>Welcome aboard! Your account has been created successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ... [Form fields remain the same] */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={inputStyle}
                  placeholder="Choose your username"
                />
                {errors.username && (
                  <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.username}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your email"
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
                      style={buttonStyle}
                    >
                      {isVerificationSent ? 'Verify Code' : 'Send Verification Code'}
                    </button>
                    {isVerificationSent && (
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter verification code"
                        style={{ ...inputStyle, marginTop: '0.5rem' }}
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
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                    placeholder="Create your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.password && (
                  <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    {errors.password}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={inputStyle}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
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

              <button type="submit" className={styles.button}>
                Start Your Journey
              </button>

              <p style={{ marginTop: '20px', color: '#666' }}>
                Already have an account? <Link href="/login">
              <button type="button" className={styles.button}>
                Sign In
              </button>
              </Link>
              </p>
            </form>
          )}
        </div>

        {/* Floating icons */}
        <div style={{ ...iconStyle, top: '5%', left: '10%' }}>✈️</div>
        <div style={{ ...iconStyle, top: '15%', right: '20%' }}>🌍</div>
        <div style={{ ...iconStyle, top: '25%', left: '5%' }}>🧳</div>
        <div style={{ ...iconStyle, top: '35%', right: '30%' }}>🚀</div>
        <div style={{ ...iconStyle, top: '50%', left: '25%' }}>🏝️</div>
        <div style={{ ...iconStyle, bottom: '15%', right: '10%' }}>✈️</div>
        <div style={{ ...iconStyle, bottom: '50%', right: '5%' }}>✈️</div>
        <div style={{ ...iconStyle, bottom: '5%', left: '15%' }}>🌍</div>
        <div style={{ ...iconStyle, bottom: '25%', right: '5%' }}>🧳</div>
        <div style={{ ...iconStyle, bottom: '35%', left: '30%' }}>🚀</div>
        <div style={{ ...iconStyle, bottom: '10%', right: '40%' }}>🏝️</div>
        <div style={{ ...iconStyle, top: '10%', right: '40%' }}>🏝️</div>
      </div>
      <div style={imageStyle}></div>

      {/* Animations */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes slideInRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

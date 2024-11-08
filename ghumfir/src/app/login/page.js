'use client';

import { useState, useEffect } from 'react';
import styles from './login.module.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);   }, []);

  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'white',
  };

  const imageStyle = {
    flex: '0.6',  
    background: 'url("/machapuchrevector.jpg") no-repeat center center',
    backgroundSize: 'cover',
    transform: animate ? 'translateX(0)' : 'translateX(-100%)',
    opacity: animate ? 1 : 0,
    animation: animate ? 'slideIn 1s ease-out' : 'none',
    borderTopRightRadius: '40px',
    borderBottomRightRadius: '40px',
    transition: 'transform 1.5s ease-out, opacity 2s ease-out',
    position:'relative'
  };

  

  const rightSideStyle = {
    flex: '0.4', 
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const formBoxStyle = {
    Width: '800px',  
    backgroundColor: 'rgba(222, 244, 244, 0.7);',
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

  const linkStyle = {
    color: '#0ea5e9',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '10px',
    color: '#333',
  };

  const titleStyle = {
    color: '#333',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '0',
  };

  const subtitleStyle = {
    color: '#666',
    marginTop: '5px',
    marginBottom: '20px',
  };

 //icons
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
   
      <div style={imageStyle}></div>
      <div style={rightSideStyle}>
        <div style={formBoxStyle}>
          <h1 style={titleStyle}>Welcome Back, Traveller!</h1>
          <p style={subtitleStyle}>Please sign in to continue</p>

          <form>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="Enter your email" style={inputStyle} />

            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                style={inputStyle}
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

            <div style={checkboxContainerStyle}>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <div style={{ marginTop: '15px' }}>
               <button type="submit" className={styles.button}>
                 Sign In
                </button>
              <a href="#" style={{ ...linkStyle, display: 'block', marginTop: '10px' }}>
                Forgot password?
              </a>
            </div>
                    
           
          </form>

          <p style={{ marginTop: '20px', color: '#666' }}>
            Don't have an account? <a href="#" className={styles.button}>Sign up</a>
          </p>
        </div>

       //icons
        <div style={{ ...iconStyle, top: '5%', left: '10%' }}>✈️</div>
        <div style={{ ...iconStyle, top: '15%', right: '20%' }}>🌍</div>
        <div style={{ ...iconStyle, top: '25%', left: '5%' }}>🧳</div>
        <div style={{ ...iconStyle, top: '35%', right: '30%' }}>🚀</div>
        <div style={{ ...iconStyle, top: '50%', left: '25%' }}>🏝️</div>
        <div style={{ ...iconStyle, bottom: '15%', right: '10%' }}>✈️</div>
        <div style={{ ...iconStyle, bottom: '5%', left: '15%' }}>🌍</div>
        <div style={{ ...iconStyle, bottom: '25%', right: '5%' }}>🧳</div>
        <div style={{ ...iconStyle, bottom: '35%', left: '30%' }}>🚀</div>
        <div style={{ ...iconStyle, bottom: '10%', right: '40%' }}>🏝️</div>
        <div style={{ ...iconStyle, top: '10%', right: '40%' }}>🏝️</div>
      </div>

     //animation
      <style jsx>{`
        @keyframes shake {
          0% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          50% {
            transform: translateX(5px);
          }
          75% {
            transform: translateX(-5px);
          }
          100% {
            transform: translateX(0);
          }
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
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideIn {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

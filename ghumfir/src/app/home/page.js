// home/page.js
import React from 'react';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Home Page</h1>
      <p style={styles.paragraph}>Explore various features of the app.</p>
      
      <div style={styles.buttonContainer}>
        <button style={styles.button}>Discover Places</button>
        <button style={styles.button}>Plan Your Trip</button>
        <button style={styles.button}>View Attractions</button>
        <button style={styles.button}>User Profile</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#f0f8ff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heading: {
    fontSize: '2.5em',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  paragraph: {
    fontSize: '1.2em',
    marginBottom: '40px',
    color: '#34495e',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '1.1em',
    borderRadius: '8px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default HomePage;

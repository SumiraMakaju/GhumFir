import Head from 'next/head';
import Slider from '../components/Slider';
import Link from 'next/link';
import styles from '../components/landing.module.css';
import axios from 'axios';

export const getCSRFToken = async () => {
  try {
    // Check if token is already in localStorage
    const storedToken = localStorage.getItem('csrftoken');
    if (storedToken) {
      return storedToken;
    }

    // Fetch CSRF token from the backend
    const response = await axios.get('/api/get_csrf/');
    
    if (response.status === 200) {
      const csrfToken = response.data?.csrfToken; // Adjust based on response format
      if (csrfToken) {
        // Cache token in localStorage
        localStorage.setItem('csrftoken', csrfToken);
        return csrfToken;
      }
      throw new Error('Invalid CSRF token format');
    }
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null; // Return null if token cannot be fetched
  }
};


export default function Home() {
  return (
    <>
      <Head>
        <title>landing Page</title>
        <meta name="description" content="landing page for ghumfir" />
      </Head>
      
            <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: '10'
      }}>
        <Link href="/login">
          <button className={styles.button}>
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className={styles.button}>
            Sign Up
          </button>
        </Link>
      </div>

      <main>
        <Slider />
      </main>
    </>
  );
}

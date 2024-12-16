import Head from 'next/head';
import Slider from '../components/Slider';
import Link from 'next/link';
import styles from '../components/landing.module.css';

export const getCSRFToken = async () => {
  if (localStorage.getItem('csrftoken')) {
    return localStorage.getItem('csrftoken');
  }
  try {
    const name = "csrftoken=";
  const cookieArr = document.cookie.split(";");

  for (let i = 0; i < cookieArr.length; i++) {
    let cookie = cookieArr[i].trim();

    if (cookie.indexOf(name) === 0) {
      localStorage.setItem('csrftoken', cookie.substring(name.length, cookie.length));
    }
  }
  return null;
  }catch(err){
    console.log(err);
  }
};

export const globalFetch = async (url, options = {}) => {
  try {
    // Get CSRF token from cookies
    const csrfToken = getCSRFToken(); // Use a cookie extraction utility

    // Set headers
    const headers = {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "", // Include CSRF token
      ...options.headers, // Merge custom headers
    };

    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Required for cookie-based authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Global Fetch Error:', error);
    throw error;
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

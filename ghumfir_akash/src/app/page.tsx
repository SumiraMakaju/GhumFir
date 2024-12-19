import Head from 'next/head';
import Slider from '../components/Slider';
import Link from 'next/link';
import styles from '../components/landing.module.css';

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
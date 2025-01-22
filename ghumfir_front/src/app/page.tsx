import Head from 'next/head';
import Slider from '../components/Slider';
import Link from 'next/link';
import styles from '../components/landing.module.css';
import { Button } from '@/components/ui/button';

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
        left: '650px',
        display: 'flex',
        gap: '30px',
        zIndex: '10'
      }}>
        <Link href="/login">
          <Button 
            style={{
              fontSize: '20px', 
              font: 'bold',
              padding: '12px 24px', 
              borderRadius: '8px', 
            }}>
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button  style={{
              fontSize: '20px', 
              font: 'bold',
              padding: '12px 24px', 
              borderRadius: '8px', 
            }} >
            Sign Up
          </Button>
        </Link>
      </div>

      <main>
        <Slider />
      </main>
    </>
  );
}
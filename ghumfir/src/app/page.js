import Head from 'next/head';
import Slider from '../components/Slider';

export default function Home() {
  return (
    <>
      <Head>
        <title>Slider Page</title>
        <meta name="description" content="A simple slider implementation in Next.js" />
      </Head>
      <main>
        <Slider />
      </main>
    </>
  );
}

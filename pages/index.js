import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Raise Calculator</title>
        <meta
          name='description'
          content='Your tool to figure out how much you should ask on your next salary review'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Raise Calculator</h1>
        <h2 className={styles.subtitle}>Coming Soon...</h2>
      </main>
    </div>
  );
}

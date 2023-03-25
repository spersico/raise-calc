import Head from 'next/head';
import styles from '../styles/Home.module.css';
import countryList from '../countryData/data/countryList.json';

import Form from '../components/Form';
import { useRouter } from 'next/navigation';

export async function getStaticProps() { return { props: { countryList } }; }

export default function Home({ countryList }) {
  const router = useRouter();

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
        <h2 className={styles.subtitle}>
          Your tool to figure out how much you should ask on your next salary
          review 💵.
        </h2>
        <Form countries={countryList.countries} router={router} />
      </main>
    </div>
  );
}

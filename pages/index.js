import Head from 'next/head';
import styles from '../styles/Home.module.css';
import countryList from '../countryData/data/countryList.json';
import Form from '../components/Form/index.js';
import Explanation from '../components/Explanation/index.js';

export async function getStaticProps() {
  return { props: { countryList } };
}

export default function Home({ countryList }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Buying Power Evolution</title>
        <meta
          name='description'
          content='How much are you really making?'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Buying Power Evolution</h1>
        <Explanation />
        <Form countries={countryList.countries} />
      </main>
    </div>
  );
}

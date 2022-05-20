import { Container, Grid } from '@mui/material';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Hands from '../public/hands.png';
import Form from '../components/form';

import getCountries from '../logic/countries';

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const { data } = await getCountries();

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data: { countries } }) {


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
          review 💵💲.
        </h2>
        <Container maxWidth='lg'>
          <Grid container columns={16}>
            <Grid item xs={10}>
              <Form countries={countries} />
            </Grid>
            <Grid item xs={6}>
              <Image
                src={Hands}
                alt='hands with cash'
                width='500'
                height='500'
              />
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

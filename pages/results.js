import Head from 'next/head';
import styles from '../styles/Results.module.css';
import countryList from '../countryData/data/countryList.json';
import { getCpiFromQuery } from './api/country/[code].js';
import Form from '../components/Form/index.js';
import ResultsSummary from '../components/ResultsSummary/index.js';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useSearchParams } from 'next/navigation';

export async function getServerSideProps(context) {
  try {
    const inflationData = getCpiFromQuery(context.query);
    return {
      props: {
        countryList,
        inflationData,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
}

export default function Results({ countryList, inflationData }) {
  const query = useSearchParams();

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
        <Accordion activeIndex={1} className={styles['p-accordion']}>
          <AccordionTab header='Used Parameters'>
            <Form countries={countryList.countries} />
          </AccordionTab>
          <AccordionTab header='Results'>
            <ResultsSummary result={inflationData} />
          </AccordionTab>
          {query.get('debug') === 'true' && (
            <AccordionTab header='Debug Raw Data'>
              <pre>{JSON.stringify(inflationData, null, 2)}</pre>
            </AccordionTab>
          )}
        </Accordion>
      </main>
    </div>
  );
}

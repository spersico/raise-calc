import Head from 'next/head';
import styles from '../styles/Home.module.css';
import countryList from '../countryData/data/countryList.json';
import { getCpiFromQuery } from './api/country/[code].js';
import Form from '../components/Form.js';
import ResultSummary from '../components/ResultSummary.js';


export async function getServerSideProps(context) {
    const country = getCpiFromQuery(context.query);
    return {
        props: {
            countryList,
            country,
        },
    };
}

export default function Results({ countryList, country }) {

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
                <Form countries={countryList.countries} />
                <ResultSummary country={country} />
            </main>
        </div>
    );
}

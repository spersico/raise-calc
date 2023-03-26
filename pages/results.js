import Head from 'next/head';
import styles from '../styles/Home.module.css';
import countryList from '../countryData/data/countryList.json';
import { getCpiFromQuery } from './api/country/[code].js';
import Form from '../components/Form.js';
import ResultSummary from '../components/ResultSummary.js';
import { useSearchParams } from 'next/navigation';


export async function getServerSideProps(context) {
    const inflationData = getCpiFromQuery(context.query);
    return {
        props: {
            countryList,
            inflationData,
        },
    };
}

export default function Results({ countryList, inflationData }) {
    const query = useSearchParams(); // TODO: remove when the form is complete

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
                <ResultSummary result={inflationData} initialSalary={query.get('initialSalary')} />
            </main>
        </div>
    );
}

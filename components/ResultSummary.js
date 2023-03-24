

export default function ResultSummary({ country }) {
    return (
        <>
            RESULTS
            <br />
            <pre>{JSON.stringify(country, null, 2)}</pre>
        </>
    );
}

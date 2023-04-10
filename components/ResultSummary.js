import { BuyingPowerGraph } from './ResultChart';


export default function ResultSummary({ result, initialSalary }) {
    return (
        <>
            <BuyingPowerGraph data={result.periods} initialSalary={initialSalary || 100} />
        </>
    );
}

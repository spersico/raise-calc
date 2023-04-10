import { useSearchParams } from 'next/navigation';
import { BuyingPowerGraph } from './components/BuyingPowerGraph';


export default function ResultSummary({ result }) {
    const query = useSearchParams();

    return (
        <>
            <BuyingPowerGraph data={result.periods} initialSalary={query.get('salary') || 100} />

        </>
    );
}

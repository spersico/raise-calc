import { useSearchParams } from 'next/navigation';
import { BuyingPowerGraph } from './components/BuyingPowerGraph';
import { BuyingPowerDescription } from './components/BuyingPowerDescription';

export default function ResultSummary({ result }) {
  const query = useSearchParams();

  return (
    <div>
      <BuyingPowerDescription
        data={result.periods}
        initialSalary={query.get('salary') || 100}
      />
      <BuyingPowerGraph
        data={result.periods}
        initialSalary={query.get('salary') || 100}
      />
    </div>
  );
}

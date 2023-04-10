import React, { useState } from 'react';
import { buyingPowerAtAPoint } from './BuyingPowerGraph';

export function BuyingPowerDescription({ data, initialSalary = 1000 }) {
  const [initialDate] = useState(data[0].date);

  const [totalBuyingPowerLostInPercentage] = useState(
    ((initialSalary -
      buyingPowerAtAPoint(initialSalary)(data[data.length - 1])) /
      initialSalary) *
      100
  );

  const [totalAcumulatedInflation] = useState(
    data[data.length - 1].acumulatedInflation
  );

  const [equivalentSalaryToOriginalBuyingPower] = useState(
    ((100 + data[data.length - 2].acumulatedInflation) / 100) * initialSalary
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        <span>
          You lost{' '}
          <strong style={{ color: 'var(--raw-sienna)' }}>
            {totalBuyingPowerLostInPercentage.toFixed(2)}%
          </strong>{' '}
          of your buying power since your last income change.
        </span>
      </p>
      <p>
        That&apos;s because your selected country has had an accumulated
        inflation of{' '}
        <strong style={{ color: 'var(--raw-sienna)' }}>
          {totalAcumulatedInflation.toFixed(2)}%
        </strong>{' '}
        since {initialDate}
      </p>

      <p>
        To keep having the same buying power as before, you would need to earn{' '}
        <strong style={{ color: 'var(--raw-sienna)' }}>
          ${equivalentSalaryToOriginalBuyingPower.toFixed(2)}
        </strong>
      </p>
    </div>
  );
}

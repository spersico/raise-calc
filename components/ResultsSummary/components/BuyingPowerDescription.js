import React from 'react';

export function BuyingPowerDescription({ data }) {
  const lastPoint = data[data.length - 1];
  return (
    <div style={{ textAlign: 'center' }}>
      <p>
        <span>
          You lost{' '}
          <strong style={{ color: 'var(--raw-sienna)' }}>
            {lastPoint.relativeBuyingPower.toFixed(2)}%
          </strong>{' '}
          of your buying power since your last income change.
        </span>
      </p>
      <p>
        That&apos;s because your selected country has had an accumulated
        inflation of{' '}
        <strong style={{ color: 'var(--raw-sienna)' }}>
          {lastPoint.accumulatedInflation.toFixed(2)}%
        </strong>{' '}
        since {data[0].date}
      </p>

      <p>
        To keep having the same buying power as before, you would need to earn{' '}
        <strong style={{ color: 'var(--raw-sienna)' }}>
          ${lastPoint.equivalentSalary.toFixed(2)}
        </strong>
      </p>
    </div>
  );
}

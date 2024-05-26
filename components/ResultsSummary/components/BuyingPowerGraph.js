import React, { useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  LineController,
  Tooltip,
  Filler,
} from 'chart.js';
import { Chart } from 'primereact/chart';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineController,
  LineElement,
  Legend,
  Tooltip,
  Filler
);

const prepareLabelFunctions = (data) => {
  function title(tooltipItems) {
    const index = tooltipItems[0].dataIndex;
    if (index === 0) return `First day of ${data[index].date}`;
    if (index === data.length - 1) return `TODAY - ESTIMATED AND ADJUSTED`;
    if (data[index].estimated) return `${data[index].date} - ESTIMATED`;
    return tooltipItems[0].date;
  }

  function footer(tooltipItems) {
    const index = tooltipItems[0].dataIndex;
    const { inflation: monthlyInflation, accumulatedInflation, equivalentSalary } = data[index];
    const inflation = monthlyInflation.toFixed(2) + '%';
    const acumInflation = accumulatedInflation.toFixed(2) + '%';
    return `Equivalent Salary: $${equivalentSalary.toFixed(2)}\n \n` + `Monthly Inflation: ${inflation}\n` + `Accumulated Inflation: ${acumInflation}`;
  }
  return { title, footer };
};

const generateOptions = (data) => {
  const labelWithData = prepareLabelFunctions(data);
  return {
    plugins: {
      tooltip: { position: 'nearest' },
      filler: {
        propagate: false,
      },
      tooltip: {
        callbacks: {
          title: labelWithData.title,
          footer: labelWithData.footer,
        },
      },
    },

    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: 'rgba(255, 255, 255, 0.25)',
        },
      },
      y: {
        border: {
          display: true,
        },
        grid: {
          display: false,
        },
      },
    },
    animations: {
      y: {
        easing: 'easeInOutElastic',
        from: (ctx) => {
          if (ctx.type === 'data') {
            if (ctx.mode === 'default' && !ctx.dropped) {
              ctx.dropped = true;
              return 0;
            }
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };
};


const generateDataset = (dataPoints, initialSalary) => {
  const buildDateLabel = ({ date }, index) => {
    if (index === 0) return `${date}-01`;
    if (index === dataPoints.length - 1) return `${date}-${String(new Date().getDate()).padStart(2, '0')}`;
    return date;
  };
  return {
    labels: dataPoints.map(buildDateLabel),
    datasets: [
      {
        label: 'Nominal Income',
        data: dataPoints.map(() => initialSalary),
        borderColor: 'rgba(255, 0, 0, 1)',
        animations: {
          y: {
            duration: 1000,
          },
        },
        radius: 0,
        borderWidth: 3,
        backgroundColor: 'rgba(255, 0, 0, 0.10)',
        fill: 1,
        tension: 0.5,
      },
      {
        label: 'Real Income',
        backgroundColor: 'rgba(0, 255, 91, 0.20)',
        borderColor: 'rgba(0, 255, 91, 1)',

        animations: {
          y: {
            duration: 1000,
            delay: 500,
          },
        },
        segment: {
          borderDash: ({ p0DataIndex, p1DataIndex }) =>
            (dataPoints[p0DataIndex].estimated ||
              dataPoints[p1DataIndex].estimated) && [4, 4],
        },
        spanGaps: true,
        fill: true,
        radius: 1,
        data: [...dataPoints.map(point => point.relativeSalary)],
        beginAtZero: true,
      },
    ],
  };
};

export function BuyingPowerGraph({ data, initialSalary }) {
  const [chartData] = useState(generateDataset(data, initialSalary));
  const [options] = useState(generateOptions(data));

  return <Chart type='line' data={chartData} options={options} />;
}

import React, { useEffect, useState } from 'react';
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


const options = {
    plugins: {
        tooltip: { position: 'nearest' },
        filler: {
            propagate: false,
        },
        title: {
            display: true,
            text: (ctx) => 'drawTime: ' + ctx.chart.options.plugins.filler.drawTime
        }
    },

    scales: {
        x: {
            border: {
                display: false
            },
            grid: {
                display: true,
                drawOnChartArea: true,
                drawTicks: true,
                color: 'rgba(255, 255, 255, 0.25)',
            }
        },
        y: {
            border: {
                display: true
            },
            grid: {
                display: false
            },
        }
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
            }
        }
    },
    interaction: {
        intersect: false,
        mode: 'index',
    },
};
const buyingPowerAtAPoint = (initialSalary) => (point) => initialSalary / (1 + (point.acumulatedInflation / 100));

export const generateDataset = (dataPoints, initialSalary) => {
    const buyingPointRelativeToSalary = buyingPowerAtAPoint(initialSalary);
    return {
        labels: dataPoints.map((dataPoint) => dataPoint.date),
        datasets: [
            {
                label: 'Your Salary',
                data: dataPoints.map(() => initialSalary),
                borderColor: 'rgba(0, 255, 91, 1)',
                animations: {
                    y: {
                        duration: 2000,
                    }
                },
                radius: 0,
                borderWidth: 3,
                backgroundColor: 'rgba(255, 0, 0, 0.25)',
                fill: 1,
                tension: 0.5
            },
            {
                label: 'Your Buying Power',
                borderColor: 'rgba(238, 255, 0, 1)',
                backgroundColor: 'rgba(0, 255, 91, 0.25)',
                animations: {
                    y: {
                        duration: 2000,
                        delay: 1000
                    }
                },
                fill: true,
                radius: 1,
                data: [initialSalary, ...dataPoints.map(buyingPointRelativeToSalary)],
                beginAtZero: true

            },
        ],
    };
};




export function BuyingPowerGraph({ data, initialSalary = 1000 }) {
    const [chartData, setChartData] = useState(generateDataset([]));
    useEffect(() => {
        data.length && setChartData(generateDataset(data, initialSalary));
    }, [data, initialSalary]);

    return <Chart type='line' data={chartData} options={options} />;
}

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const RiskGauge = ({ riskScore = 0, riskLevel = 'Unknown' }) => {
  const safeScore = Math.min(100, Math.max(0, riskScore || 0));
  const remaining = 100 - safeScore;

  const color =
    safeScore >= 70 ? 'rgba(220, 53, 69, 0.9)' : safeScore >= 40 ? 'rgba(255, 193, 7, 0.9)' : 'rgba(25, 135, 84, 0.9)';

  const data = {
    labels: ['Risk', 'Remaining'],
    datasets: [
      {
        data: [safeScore, remaining],
        backgroundColor: [color, 'rgba(233, 236, 239, 0.8)'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed} / 100`,
        },
      },
    },
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div style={{ width: 140, height: 140 }}>
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-2 text-center">
        <div className="fw-semibold">Risk Score: {safeScore}/100</div>
        <div className="small text-muted">{riskLevel}</div>
      </div>
    </div>
  );
};

export default RiskGauge;


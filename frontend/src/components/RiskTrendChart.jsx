import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const RiskTrendChart = ({ reports }) => {
  const items = useMemo(() => {
    const list = reports || [];
    return [...list]
      .filter((r) => r.analysis && typeof r.analysis.riskScore !== 'undefined')
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
      .slice(-12);
  }, [reports]);

  if (!items.length) {
    return (
      <div className="border rounded-3 p-3 bg-white">
        <h6 className="mb-2 d-flex align-items-center">
          <i className="bi bi-graph-up me-2 text-primary"></i>
          Risk Trend
        </h6>
        <p className="small text-muted mb-0">Trend chart appears after multiple reports.</p>
      </div>
    );
  }

  const labels = items.map((r) => {
    try {
      return new Date(r.createdAt).toLocaleDateString();
    } catch {
      return '—';
    }
  });

  const values = items.map((r) => Number(r.analysis.riskScore || 0));

  const data = {
    labels,
    datasets: [
      {
        label: 'Risk score',
        data: values,
        borderColor: 'rgba(11, 94, 215, 0.9)',
        backgroundColor: 'rgba(11, 94, 215, 0.15)',
        tension: 0.35,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Risk score: ${ctx.parsed.y}/100`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <div className="border rounded-3 p-3 bg-white" style={{ minHeight: 220 }}>
      <h6 className="mb-2 d-flex align-items-center">
        <i className="bi bi-graph-up me-2 text-primary"></i>
        Risk Trend
      </h6>
      <div style={{ height: 170 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RiskTrendChart;


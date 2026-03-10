import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MetricsChart = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="border rounded-3 p-3 bg-white">
        <h6 className="mb-2 d-flex align-items-center">
          <i className="bi bi-bar-chart me-2 text-primary"></i>
          Health Visualization
        </h6>
        <p className="small text-muted mb-0">
          Once key lab values are detected, they will be visualized here.
        </p>
      </div>
    );
  }

  const labels = metrics.map((m) => m.label);
  const values = metrics.map((m) => m.value);
  const backgroundColors = metrics.map((m) =>
    m.color === 'red' ? 'rgba(220, 53, 69, 0.6)' : m.color === 'yellow' ? 'rgba(255, 193, 7, 0.6)' : 'rgba(25, 135, 84, 0.6)'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Value',
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="border rounded-3 p-3 bg-white" style={{ minHeight: 220 }}>
      <h6 className="mb-2 d-flex align-items-center">
        <i className="bi bi-bar-chart me-2 text-primary"></i>
        Health Visualization
      </h6>
      <div style={{ height: 180 }}>
        <Bar data={data} options={options} />
      </div>
      <div className="d-flex justify-content-end gap-2 mt-2 small">
        <span className="badge bg-success">Normal</span>
        <span className="badge bg-warning text-dark">Warning</span>
        <span className="badge bg-danger">High risk</span>
      </div>
    </div>
  );
};

export default MetricsChart;


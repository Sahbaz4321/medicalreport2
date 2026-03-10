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
      <div className="card-modern p-4 bg-white border-0 shadow-sm h-100">
        <div className="d-flex align-items-center mb-3">
          <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
            <i className="bi bi-bar-chart-fill text-primary fs-5"></i>
          </div>
          <h6 className="fw-bold mb-0">Health Metrics Chart</h6>
        </div>
        <div className="text-center py-4">
          <div className="rounded-circle bg-light p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
            <i className="bi bi-graph-up text-muted" style={{fontSize: '1.5rem'}}></i>
          </div>
          <p className="text-muted small mb-0">
            No health metrics available for visualization.
          </p>
        </div>
      </div>
    );
  }

  const labels = metrics.map((m) => m.label);
  const values = metrics.map((m) => m.value);
  const backgroundColors = metrics.map((m) =>
    m.color === 'red' ? 'rgba(220, 53, 69, 0.8)' : m.color === 'yellow' ? 'rgba(255, 193, 7, 0.8)' : 'rgba(25, 135, 84, 0.8)'
  );
  const borderColors = metrics.map((m) =>
    m.color === 'red' ? 'rgba(220, 53, 69, 1)' : m.color === 'yellow' ? 'rgba(255, 193, 7, 1)' : 'rgba(25, 135, 84, 1)'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Health Metric Value',
        data: values,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        callbacks: {
          title: (context) => `${context[0].label}`,
          label: (ctx) => {
            const metric = metrics[ctx.dataIndex];
            return [`Value: ${ctx.parsed.y}`, `Status: ${metric.status || 'Unknown'}`];
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: '500',
          },
          color: '#6c757d',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: '#6c757d',
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="card-modern p-4 bg-white border-0 shadow-sm h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
            <i className="bi bi-bar-chart-fill text-primary fs-5"></i>
          </div>
          <h6 className="fw-bold mb-0">Health Metrics Chart</h6>
        </div>
        <div className="d-flex gap-1">
          <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1" style={{fontSize: '0.7rem'}}>Normal</span>
          <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 py-1" style={{fontSize: '0.7rem'}}>Warning</span>
          <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-2 py-1" style={{fontSize: '0.7rem'}}>High Risk</span>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <Bar data={data} options={options} />
      </div>
      <div className="mt-3 pt-3 border-top">
        <div className="d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            <i className="bi bi-info-circle me-1"></i>
            {metrics.length} parameters analyzed
          </div>
          <div className="small text-muted">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsChart;


import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MetricsPieChart = ({ metrics }) => {
  const { normalCount, abnormalCount } = useMemo(() => {
    const list = metrics || [];
    const normalCount = list.filter((m) => m.status === 'normal').length;
    const abnormalCount = list.length - normalCount;
    return { normalCount, abnormalCount };
  }, [metrics]);

  if (!metrics || metrics.length === 0) {
    return (
      <div className="card-modern p-4 bg-white border-0 shadow-sm h-100">
        <div className="d-flex align-items-center mb-3">
          <div className="rounded-circle bg-info bg-opacity-10 p-2 me-2">
            <i className="bi bi-pie-chart-fill text-info fs-5"></i>
          </div>
          <h6 className="fw-bold mb-0">Health Status Overview</h6>
        </div>
        <div className="text-center py-4">
          <div className="rounded-circle bg-light p-3 mx-auto mb-3" style={{width: '60px', height: '60px'}}>
            <i className="bi bi-pie-chart text-muted" style={{fontSize: '1.5rem'}}></i>
          </div>
          <p className="text-muted small mb-0">
            No health data available for status overview.
          </p>
        </div>
      </div>
    );
  }

  const data = {
    labels: ['Normal', 'Abnormal'],
    datasets: [
      {
        data: [normalCount, abnormalCount],
        backgroundColor: ['rgba(25, 135, 84, 0.85)', 'rgba(220, 53, 69, 0.85)'],
        borderColor: ['rgba(25, 135, 84, 1)', 'rgba(220, 53, 69, 1)'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '500',
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor[i],
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        },
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
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: false,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="card-modern p-4 bg-white border-0 shadow-sm h-100">
      <div className="d-flex align-items-center mb-3">
        <div className="rounded-circle bg-info bg-opacity-10 p-2 me-2">
          <i className="bi bi-pie-chart-fill text-info fs-5"></i>
        </div>
        <h6 className="fw-bold mb-0">Health Status Overview</h6>
      </div>
      <div style={{ height: 180 }}>
        <Pie data={data} options={options} />
      </div>
      <div className="mt-3 pt-3 border-top">
        <div className="row g-2 text-center">
          <div className="col-6">
            <div className="small text-muted">Normal</div>
            <div className="fw-bold text-success">{normalCount}</div>
          </div>
          <div className="col-6">
            <div className="small text-muted">Abnormal</div>
            <div className="fw-bold text-danger">{abnormalCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPieChart;


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
      <div className="border rounded-3 p-3 bg-white">
        <h6 className="mb-2 d-flex align-items-center">
          <i className="bi bi-pie-chart me-2 text-primary"></i>
          Normal vs Abnormal
        </h6>
        <p className="small text-muted mb-0">Pie chart appears once parameters are available.</p>
      </div>
    );
  }

  const data = {
    labels: ['Normal', 'Abnormal'],
    datasets: [
      {
        data: [normalCount, abnormalCount],
        backgroundColor: ['rgba(25, 135, 84, 0.75)', 'rgba(220, 53, 69, 0.75)'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div className="border rounded-3 p-3 bg-white" style={{ minHeight: 220 }}>
      <h6 className="mb-2 d-flex align-items-center">
        <i className="bi bi-pie-chart me-2 text-primary"></i>
        Normal vs Abnormal
      </h6>
      <div style={{ height: 170 }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};

export default MetricsPieChart;


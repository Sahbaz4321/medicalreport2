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
  Filler,
} from 'chart.js';
import { TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Risk Trend</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-3">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Trend chart will appear after analyzing multiple reports
          </p>
        </div>
      </div>
    );
  }

  const labels = items.map((r) => {
    try {
      const date = new Date(r.createdAt);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  });

  const values = items.map((r) => Number(r.analysis?.riskScore || 0));

  const data = {
    labels,
    datasets: [
      {
        label: 'Risk Score',
        data: values,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(16, 185, 129)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 14,
        },
        callbacks: {
          label: (ctx) => `Risk Score: ${ctx.parsed.y}/100`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: (value) => `${value}`,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Risk Trend</h3>
            <p className="text-xs text-gray-500">Last {items.length} reports</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-emerald-700">Live Data</span>
        </div>
      </div>

      <div style={{ height: 220 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RiskTrendChart;

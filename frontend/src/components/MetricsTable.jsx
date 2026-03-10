import React from 'react';

const statusBadgeClass = (color) => {
  if (color === 'red') return 'bg-danger';
  if (color === 'yellow') return 'bg-warning text-dark';
  return 'bg-success';
};

const MetricsTable = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="border rounded-3 p-3 bg-white h-100">
        <h6 className="mb-2 d-flex align-items-center">
          <i className="bi bi-list-ul me-2 text-secondary"></i>
          Medical Parameters
        </h6>
        <p className="small text-muted mb-0">
          No standard lab values were recognized in this report.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-3 p-3 bg-white h-100">
      <h6 className="mb-2 d-flex align-items-center">
        <i className="bi bi-list-ul me-2 text-secondary"></i>
        Medical Parameters
      </h6>
      <div className="table-responsive small mb-0">
        <table className="table table-sm align-middle mb-0">
          <thead>
            <tr>
              <th>Parameter</th>
              <th className="text-end">Value</th>
              <th className="text-end">Normal Range</th>
              <th>Status</th>
              <th style={{ minWidth: 260 }}>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.key}>
                <td>{m.label}</td>
                <td className="text-end">
                  {m.value} {m.unit}
                </td>
                <td className="text-end text-muted">
                  {m.normalRange ? `${m.normalRange.min}–${m.normalRange.max}` : '—'}
                </td>
                <td>
                  <span className={`badge ${statusBadgeClass(m.color)}`}>
                    {m.status === 'normal'
                      ? 'Normal'
                      : m.status === 'low'
                      ? 'Low'
                      : m.status === 'high'
                      ? 'High'
                      : 'Abnormal'}
                  </span>
                </td>
                <td className="text-muted">{m.explanation || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;


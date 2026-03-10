import React from 'react';

const PatientSummaryCard = ({ patient, reportType, date }) => {
  const name = patient?.name || 'Unknown';
  const age = patient?.age || 'Unknown';
  const sex = patient?.sex || 'Unknown';

  return (
    <div className="border rounded-3 p-3 bg-white">
      <h6 className="mb-2 d-flex align-items-center">
        <i className="bi bi-person-badge me-2 text-primary"></i>
        Patient & Report
      </h6>
      <div className="row g-2 small">
        <div className="col-12 col-md-6">
          <div className="text-muted">Patient</div>
          <div className="fw-semibold">{name}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-muted">Age</div>
          <div className="fw-semibold">{age}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-muted">Sex</div>
          <div className="fw-semibold">{sex}</div>
        </div>
        <div className="col-12 col-md-6">
          <div className="text-muted">Report type</div>
          <div className="fw-semibold">{reportType || 'Unknown'}</div>
        </div>
        <div className="col-12 col-md-6">
          <div className="text-muted">Date</div>
          <div className="fw-semibold">{date || 'Unknown'}</div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryCard;


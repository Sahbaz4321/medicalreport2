import React from 'react';

const PatientSummaryCard = ({ patient, reportType, date }) => {
  const name = patient?.name || 'Unknown';
  const age = patient?.age || 'Unknown';
  const sex = patient?.sex || 'Unknown';

  return (
    <div className="card-modern border-0 shadow-lg p-4 bg-gradient-to-r from-blue-50 to-white hover-lift">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm me-3" style={{width: '40px', height: '40px', fontSize: '1.2rem'}}>
          1
        </div>
        <h5 className="fw-bold mb-0 text-dark">Patient Details</h5>
      </div>
      
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="d-flex align-items-start">
            <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
              <i className="bi bi-person-badge text-primary fs-5"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold mb-1">Patient Name</div>
              <div className="fw-bold fs-6 text-dark">{name}</div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-2">
          <div className="d-flex align-items-start">
            <div className="rounded-circle bg-info bg-opacity-10 p-2 me-3">
              <i className="bi bi-calendar-event text-info fs-5"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold mb-1">Age</div>
              <div className="fw-bold fs-6 text-dark">{age}</div>
            </div>
          </div>
        </div>
        
        <div className="col-6 col-md-2">
          <div className="d-flex align-items-start">
            <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-3">
              <i className="bi bi-gender-ambiguous text-danger fs-5"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold mb-1">Sex</div>
              <div className="fw-bold fs-6 text-dark">{sex}</div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-4">
          <div className="d-flex align-items-start">
            <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
              <i className="bi bi-file-medical text-success fs-5"></i>
            </div>
            <div>
              <div className="text-muted small text-uppercase fw-semibold mb-1">Report Context</div>
              <div className="fw-bold fs-6 text-dark text-truncate" title={reportType}>{reportType || 'Standard Analysis'}</div>
              <div className="text-muted small mt-1"><i className="bi bi-clock me-1"></i>{date || 'Unknown Date'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSummaryCard;

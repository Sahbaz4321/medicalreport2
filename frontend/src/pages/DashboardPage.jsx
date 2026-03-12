import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import UploadCard from '../components/UploadCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNewAnalysis = (reportRecord) => {
    navigate(`/report/${reportRecord.id}`);
  };

  if (!user) return null;

  return (
    <div className="dashboard-container py-5 fade-in flex-grow-1" style={{minHeight: 'calc(100vh - 75px)', background: '#f5f9ff'}}>
      <div className="container h-100 d-flex flex-column justify-content-center">
        <div className="row justify-content-center">
          
          {/* Main Upload Section */}
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="text-center mb-5">
              <h1 className="fw-bold display-5 mb-3 text-dark">Analyze a Medical Report</h1>
              <p className="text-muted lead mx-auto">
                Upload your medical report and let our AI extract the findings, calculate risk scores, and highlight key insights instantly.
              </p>
            </div>

            <div className="card-modern upload-section p-5 border-0 shadow-lg bg-white d-flex flex-column justify-content-center align-items-center hover-lift" style={{borderRadius: '24px'}}>
              <div className="card-header-custom text-center mb-4 d-flex flex-column align-items-center">
                <div className="header-icon mb-3 bg-primary bg-opacity-10" style={{width: 80, height: 80, borderRadius: '24px'}}>
                  <i className="bi bi-cloud-arrow-up-fill text-primary" style={{fontSize: '2.5rem'}}></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-2">Upload File</h4>
                  <p className="text-muted mb-0">Select a PDF or image report</p>
                </div>
              </div>
              <div className="w-100 px-md-4">
                <UploadCard onAnalyzed={handleNewAnalysis} />
              </div>
              <div className="mt-4 pt-4 border-top w-100 text-center">
                <p className="small text-muted mb-0"><i className="bi bi-shield-check text-success me-1"></i>Secure & Private Storage</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


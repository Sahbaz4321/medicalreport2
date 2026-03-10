import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { database, dbRef, onValue } from '../services/firebaseClient';
import UploadCard from '../components/UploadCard';
import AnalysisPanel from '../components/AnalysisPanel';
import ChatPanel from '../components/ChatPanel';

const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const reportIdFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('reportId');
  }, [location.search]);

  useEffect(() => {
    if (!user) return;

    const reportsRef = dbRef(database, `users/${user.uid}/reports`);
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      const val = snapshot.val() || {};
      const list = Object.entries(val)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setReports(list);

      if (!selectedReportId && list.length > 0) {
        setSelectedReportId(list[0].id);
      }
    });

    return () => unsubscribe();
  }, [user, selectedReportId]);

  useEffect(() => {
    if (reportIdFromQuery) {
      setSelectedReportId(reportIdFromQuery);
    }
  }, [reportIdFromQuery]);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || null;
  const analysis = selectedReport ? selectedReport.analysis || null : null;

  const handleNewAnalysis = (reportRecord) => {
    setSelectedReportId(reportRecord.id);
  };

  const handleSelectExisting = (report) => {
    setSelectedReportId(report.id);
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      default: return 'risk-low';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard-container py-4 fade-in">
      <div className="row g-4">
        {/* Left Sidebar - Upload & Reports */}
        <div className="col-12 col-lg-3">
          <div className="dashboard-card upload-section mb-4">
            <div className="card-header-custom">
              <div className="header-icon">
                <i className="bi bi-cloud-arrow-up-fill"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-0">Upload & Analyze</h5>
                <small className="text-muted">AI-powered insights</small>
              </div>
            </div>
            <p className="text-muted mb-3">
              Upload a new PDF or image report and get instant AI-powered health analysis.
            </p>
            <UploadCard onAnalyzed={handleNewAnalysis} />
          </div>

          {/* Recent Reports */}
          <div className="dashboard-card reports-section">
            <div className="card-header-custom">
              <div className="header-icon bg-secondary">
                <i className="bi bi-clock-history"></i>
              </div>
              <div>
                <h6 className="fw-bold mb-0">Recent Reports</h6>
                <small className="text-muted">{reports.length} total</small>
              </div>
            </div>
            
            {reports.length === 0 ? (
              <div className="empty-state text-center py-4">
                <div className="empty-icon mb-2">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
                <p className="text-muted small mb-0">No reports yet. Upload your first report to get started.</p>
              </div>
            ) : (
              <div className="reports-list">
                {reports.slice(0, 8).map((r, index) => (
                  <div
                    key={r.id}
                    className={`report-item ${selectedReportId && selectedReportId === r.id ? 'active' : ''}`}
                    onClick={() => handleSelectExisting(r)}
                    style={{animationDelay: `${index * 50}ms`}}
                  >
                    <div className="report-icon">
                      <i className="bi bi-file-earmark-medical"></i>
                    </div>
                    <div className="report-info flex-grow-1">
                      <div className="report-name text-truncate">
                        {r.fileName || 'Medical Report'}
                      </div>
                      <div className="report-meta">
                        <span className="report-date">{formatDate(r.createdAt)}</span>
                        {r.analysis?.riskScore && (
                          <span className="report-score">
                            <span className="score-value">{r.analysis.riskScore}</span>/100
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="report-risk">
                      <span className={`risk-badge ${getRiskBadgeClass(r.analysis?.riskLevel)}`}>
                        {r.analysis?.riskLevel || 'Analyzed'}
                      </span>
                    </div>
                  </div>
                ))}
                {reports.length > 8 && (
                  <div className="view-more text-center mt-2">
                    <small className="text-muted">
                      +{reports.length - 8} more reports
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Analysis Panel */}
        <div className="col-12 col-lg-6">
          <AnalysisPanel analysis={analysis} reports={reports} />
        </div>

        {/* Right Sidebar - Chat Panel */}
        <div className="col-12 col-lg-3">
          <ChatPanel analysis={analysis} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


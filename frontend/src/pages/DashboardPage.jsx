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

      // Auto-select newest report on first load
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
    // Immediately switch the UI to the newly analyzed report
    setSelectedReportId(reportRecord.id);
  };

  const handleSelectExisting = (report) => {
    setSelectedReportId(report.id);
  };

  return (
    <div className="container py-4 fade-in">
      <div className="row g-3">
        <div className="col-12 col-lg-3">
          <div className="card-modern p-4 bg-white mb-3">
              <h5 className="card-title d-flex align-items-center">
                <i className="bi bi-cloud-arrow-up me-2 text-primary"></i>
                Upload & Analyze
              </h5>
              <p className="text-muted small mb-3">
                Upload a new PDF or image report, run OCR, and get AI-powered insights.
              </p>
              <UploadCard onAnalyzed={handleNewAnalysis} />
          </div>

          <div className="card-modern p-4 bg-white">
              <h6 className="card-title mb-2">
                <i className="bi bi-clock-history me-2 text-secondary"></i>
                Recent Reports
              </h6>
              {reports.length === 0 && (
                <p className="text-muted small mb-0">No reports yet. Upload your first report.</p>
              )}
              <div className="list-group small">
                {reports.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={
                      'list-group-item list-group-item-action d-flex justify-content-between align-items-center ' +
                      (selectedReportId && selectedReportId === r.id ? 'active' : '')
                    }
                    onClick={() => handleSelectExisting(r)}
                  >
                    <span className="text-truncate" style={{ maxWidth: '70%' }}>
                      {r.fileName || 'Report'}
                    </span>
                    <span className="badge bg-light text-dark">
                      {r.analysis?.riskLevel || 'N/A'}
                    </span>
                  </button>
                ))}
              </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <AnalysisPanel analysis={analysis} reports={reports} />
        </div>

        <div className="col-12 col-lg-3">
          <ChatPanel analysis={analysis} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;


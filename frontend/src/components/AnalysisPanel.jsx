import React from 'react';
import MetricsTable from './MetricsTable';
import MetricsChart from './MetricsChart';
import MetricsPieChart from './MetricsPieChart';
import RiskGauge from './RiskGauge';
import RiskTrendChart from './RiskTrendChart';
import VoiceExplanationButton from './VoiceExplanationButton';
import DownloadSummaryButton from './DownloadSummaryButton';
import PatientSummaryCard from './PatientSummaryCard';

const AnalysisPanel = ({ analysis, reports }) => {
  if (!analysis) {
    return (
      <div className="card-modern p-5 bg-white h-100 d-flex flex-column justify-content-center align-items-center text-center border-0 shadow-lg">
        <div className="rounded-circle bg-primary bg-opacity-10 p-4 mb-3">
          <i className="bi bi-file-medical text-primary" style={{fontSize: '3rem'}}></i>
        </div>
        <h5 className="fw-bold text-primary mb-2">No Report Selected</h5>
        <p className="text-muted mb-4">
          Upload a medical report to see AI-powered explanations, abnormal values, and health insights.
        </p>
        <div className="d-flex gap-2">
          <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
            <i className="bi bi-check2-circle me-1"></i>
            AI Analysis
          </div>
          <div className="badge bg-success bg-opacity-10 text-success px-3 py-2">
            <i className="bi bi-graph-up me-1"></i>
            Health Insights
          </div>
          <div className="badge bg-info bg-opacity-10 text-info px-3 py-2">
            <i className="bi bi-chat-dots me-1"></i>
            AI Chat
          </div>
        </div>
      </div>
    );
  }

  const {
    summary,
    riskScore,
    riskLevel,
    dietAndLifestyle,
    doctorRecommendation,
    metrics,
    extractedText,
    aiMeta,
    patient,
    reportType,
    date,
    findings,
    conditions,
    precautions,
    effects,
    recovery,
    diet,
    advantages,
    disadvantages,
  } = analysis;

  const aiBadge = aiMeta?.used
    ? `AI: ${aiMeta.provider} (${aiMeta.mode || 'ok'})`
    : `AI: fallback (${aiMeta?.provider || 'none'})`;
  const aiError = aiMeta?.used ? null : aiMeta?.error;

  return (
    <div className="card-modern p-4 bg-white h-100 border-0 shadow-lg">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <div className="d-flex align-items-center mb-2">
            <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
              <i className="bi bi-clipboard2-pulse text-primary fs-5"></i>
            </div>
            <h5 className="fw-bold mb-0">AI Report Analysis</h5>
          </div>
          <p className="text-muted mb-2">
            Comprehensive health analysis with AI-powered insights and recommendations.
          </p>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className={`badge rounded-pill ${aiMeta?.used ? 'bg-primary' : 'bg-secondary'}`}>
              <i className="bi bi-cpu me-1"></i>
              {aiBadge}
            </span>
            {aiError && (
              <span className="badge bg-danger rounded-pill">
                <i className="bi bi-exclamation-triangle me-1"></i>
                {aiError}
              </span>
            )}
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
          <VoiceExplanationButton text={summary} />
          <DownloadSummaryButton analysis={analysis} />
        </div>
      </div>

      {/* Health Score & Key Insights */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card-modern border-0 shadow-sm p-4 h-100 bg-gradient-to-br from-primary-subtle to-white">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-danger bg-opacity-10 p-2 me-2">
                <i className="bi bi-heart-pulse-fill text-danger fs-5"></i>
              </div>
              <h6 className="fw-bold mb-0">Health Risk Score</h6>
            </div>
            <p className="text-muted small mb-3">
              Calculated risk score based on detected medical values and parameters.
            </p>
            <RiskGauge riskScore={riskScore} riskLevel={riskLevel} />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card-modern border-0 shadow-sm p-4 h-100 bg-gradient-to-br from-warning-subtle to-white">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                <i className="bi bi-lightbulb-fill text-warning fs-5"></i>
              </div>
              <h6 className="fw-bold mb-0">Key Insights</h6>
            </div>
            <div className="bg-white rounded-3 p-3">
              <p className="small mb-0">{summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information & Medical Details */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <PatientSummaryCard patient={patient} reportType={reportType} date={date} />
        </div>
        <div className="col-12 col-lg-6">
          <div className="card-modern border-0 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-info bg-opacity-10 p-2 me-2">
                <i className="bi bi-journal-medical text-info fs-5"></i>
              </div>
              <h6 className="fw-bold mb-0">Medical Findings</h6>
            </div>
            {(findings || []).length ? (
              <ul className="small mb-0 ps-3">
                {findings.map((f, idx) => (
                  <li key={idx} className="mb-1">{f}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small mb-0">No specific findings extracted.</p>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card-modern border-0 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-2">
                <i className="bi bi-exclamation-triangle-fill text-warning fs-5"></i>
              </div>
              <h6 className="fw-bold mb-0">Conditions & Problems</h6>
            </div>
            {(conditions || []).length ? (
              <ul className="small mb-0 ps-3">
                {conditions.map((c, idx) => (
                  <li key={idx} className="mb-1">{c}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small mb-0">No conditions identified.</p>
            )}
          </div>
        </div>
      </div>

      {/* OCR Text Preview */}
      <div className="mb-4">
        <div className="accordion" id="ocrAccordion">
          <div className="accordion-item border-0 shadow-sm">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed bg-light"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#ocrCollapse"
                aria-expanded="false"
                aria-controls="ocrCollapse"
              >
                <div className="d-flex align-items-center">
                  <i className="bi bi-file-text me-2 text-primary"></i>
                  <span className="fw-medium">Extracted OCR Text</span>
                  <span className="ms-2 badge bg-primary rounded-pill">
                    {extractedText ? `${Math.round(extractedText.length / 1000)}k chars` : '0 chars'}
                  </span>
                </div>
              </button>
            </h2>
            <div id="ocrCollapse" className="accordion-collapse collapse" data-bs-parent="#ocrAccordion">
              <div className="accordion-body bg-light">
                <pre className="small mb-0 p-3 bg-white rounded-3" style={{ whiteSpace: 'pre-wrap', maxHeight: '300px', overflowY: 'auto' }}>
                  {extractedText || 'No OCR text extracted. Try a clearer photo or higher resolution scan.'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Charts */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-6">
          <MetricsTable metrics={metrics || []} />
        </div>
        <div className="col-12 col-xl-6">
          <div className="row g-3">
            <div className="col-12">
              <MetricsChart metrics={metrics || []} />
            </div>
            <div className="col-12">
              <MetricsPieChart metrics={metrics || []} />
            </div>
            <div className="col-12">
              <RiskTrendChart reports={reports || []} />
            </div>
          </div>
        </div>
      </div>

      {/* Medical Recommendations & Lifestyle */}
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card-modern border-0 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-info bg-opacity-10 p-2 me-2">
                <i className="bi bi-people-fill text-info fs-5"></i>
              </div>
              <h6 className="fw-bold mb-0">Doctor Recommendations</h6>
            </div>
            <div className="bg-light rounded-3 p-3">
              <p className="small mb-0">{doctorRecommendation || 'No specific recommendations provided.'}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card-modern border-0 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-success bg-opacity-10 p-2 me-2">
                <i className="bi bi-heart-fill text-success fs-5"></i>
              </div>
              <h6 className="fw-bold mb-0">Diet & Lifestyle</h6>
            </div>
            {(dietAndLifestyle || []).length ? (
              <ul className="small mb-0 ps-3">
                {dietAndLifestyle.map((item, idx) => (
                  <li key={idx} className="mb-1">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted small mb-0">No lifestyle recommendations available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPanel;


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
      <div className="card-modern p-4 bg-white h-100 d-flex flex-column justify-content-center align-items-center text-center text-muted">
          <i className="bi bi-file-medical display-4 mb-3 text-secondary"></i>
          <p className="mb-1 fw-semibold">No report selected</p>
          <p className="small mb-0">
            Upload a medical report to see AI-powered explanations, abnormal values, and health
            insights here.
          </p>
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
    <div className="card-modern p-4 bg-white h-100">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
          <div>
            <h5 className="card-title d-flex align-items-center">
              <i className="bi bi-clipboard2-pulse me-2 text-primary"></i>
              AI Report Summary
            </h5>
            <p className="text-muted small mb-2">
              Simplified overview, abnormal value detection, and health insights.
            </p>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className={`badge ${aiMeta?.used ? 'bg-primary' : 'bg-secondary'}`}>
                {aiBadge}
              </span>
              {aiError && (
                <span className="badge bg-danger">
                  AI error: {aiError}
                </span>
              )}
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <VoiceExplanationButton text={summary} />
            <DownloadSummaryButton analysis={analysis} />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <div className="border rounded-3 p-3 h-100 bg-light">
              <h6 className="mb-2 d-flex align-items-center">
                <i className="bi bi-heart-pulse me-2 text-danger"></i>
                Overall Health Risk
              </h6>
              <p className="mb-1 small">
                Estimated risk score from 0–100 based on detected values.
              </p>
              <RiskGauge riskScore={riskScore} riskLevel={riskLevel} />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="border rounded-3 p-3 h-100 bg-light">
              <h6 className="mb-2 d-flex align-items-center">
                <i className="bi bi-lightbulb me-2 text-warning"></i>
                Key Insights
              </h6>
              <p className="small mb-0">{summary}</p>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <PatientSummaryCard patient={patient} reportType={reportType} date={date} />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-6">
            <div className="border rounded-3 p-3 bg-white h-100">
              <h6 className="mb-2 d-flex align-items-center">
                <i className="bi bi-journal-medical me-2 text-secondary"></i>
                Findings
              </h6>
              {(findings || []).length ? (
                <ul className="small mb-0">
                  {findings.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              ) : (
                <p className="small text-muted mb-0">No findings extracted.</p>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="border rounded-3 p-3 bg-white h-100">
              <h6 className="mb-2 d-flex align-items-center">
                <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
                Conditions / Problems
              </h6>
              {(conditions || []).length ? (
                <ul className="small mb-0">
                  {conditions.map((c, idx) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="small text-muted mb-0">No conditions extracted.</p>
              )}
            </div>
          </div>
        </div>

        <div className="accordion mb-3" id="ocrAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#ocrCollapse"
                aria-expanded="false"
                aria-controls="ocrCollapse"
              >
                OCR Text Preview{' '}
                <span className="ms-2 badge bg-light text-dark">
                  {extractedText ? `${extractedText.length} chars` : '0 chars'}
                </span>
              </button>
            </h2>
            <div id="ocrCollapse" className="accordion-collapse collapse" data-bs-parent="#ocrAccordion">
              <div className="accordion-body">
                <pre className="small mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                  {extractedText || 'No OCR text extracted. Try a clearer photo or higher resolution scan.'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
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
            <div className="mt-3">
              <h6 className="mb-2 d-flex align-items-center">
                <i className="bi bi-people me-2 text-info"></i>
                Doctor Recommendation
              </h6>
              <p className="small mb-2">{doctorRecommendation}</p>
              <h6 className="mb-1 d-flex align-items-center">
                <i className="bi bi-basket3 me-2 text-success"></i>
                Diet & Lifestyle Suggestions
              </h6>
              <ul className="small mb-0">
                {(dietAndLifestyle || []).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <hr />

              <h6 className="mb-1 d-flex align-items-center">
                <i className="bi bi-shield-check me-2 text-primary"></i>
                Precautions
              </h6>
              {(precautions || []).length ? (
                <ul className="small mb-2">
                  {precautions.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              ) : (
                <p className="small text-muted mb-2">No precautions extracted.</p>
              )}

              <h6 className="mb-1 d-flex align-items-center">
                <i className="bi bi-egg-fried me-2 text-success"></i>
                Diet
              </h6>
              {(diet || []).length ? (
                <ul className="small mb-2">
                  {diet.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              ) : (
                <p className="small text-muted mb-2">No diet plan extracted.</p>
              )}

              <h6 className="mb-1 d-flex align-items-center">
                <i className="bi bi-hourglass-split me-2 text-secondary"></i>
                Recovery
              </h6>
              <p className="small mb-2">
                <span className="fw-semibold">Expected time:</span>{' '}
                {recovery?.expectedTime || 'Unknown'}
                <br />
                <span className="fw-semibold">Depends on:</span> {recovery?.dependsOn || 'Unknown'}
              </p>

              <h6 className="mb-1 d-flex align-items-center">
                <i className="bi bi-graph-up-arrow me-2 text-info"></i>
                Effects (possible)
              </h6>
              {(effects || []).length ? (
                <ul className="small mb-2">
                  {effects.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              ) : (
                <p className="small text-muted mb-2">No effects extracted.</p>
              )}

              <div className="row g-2">
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-2 bg-light h-100">
                    <div className="small fw-semibold mb-1">
                      <i className="bi bi-check-circle me-1 text-success"></i>
                      Advantages
                    </div>
                    {(advantages || []).length ? (
                      <ul className="small mb-0">
                        {advantages.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="small text-muted">None extracted.</div>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded-3 p-2 bg-light h-100">
                    <div className="small fw-semibold mb-1">
                      <i className="bi bi-x-circle me-1 text-danger"></i>
                      Disadvantages
                    </div>
                    {(disadvantages || []).length ? (
                      <ul className="small mb-0">
                        {disadvantages.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="small text-muted">None extracted.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AnalysisPanel;


import React from 'react';

const AboutPage = () => {
  return (
    <div className="container py-4 fade-in">
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card-modern p-4 bg-white">
            <h2 className="h4 fw-bold mb-2">About Us</h2>
            <p className="text-muted">
              AI Medical Report Analyzer is a demo-grade healthcare dashboard built for fast,
              clear interpretation of medical reports. It uses OCR to extract text and AI to turn
              complex findings into simple explanations, insights, and visual summaries.
            </p>
            <div className="row g-3 mt-1">
              {[
                {
                  icon: 'bi-shield-check',
                  title: 'Privacy-first',
                  desc: 'Runs on your Firebase project. You control data storage and rules.',
                },
                {
                  icon: 'bi-lightning-charge',
                  title: 'Fast insights',
                  desc: 'Designed for quick triage and easy understanding.',
                },
                {
                  icon: 'bi-graph-up',
                  title: 'Visual dashboard',
                  desc: 'Charts + color coding to spot risks instantly.',
                },
              ].map((x, idx) => (
                <div className="col-12 col-md-4" key={idx}>
                  <div className="border rounded-3 p-3 h-100">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <i className={`bi ${x.icon} text-primary`}></i>
                      <div className="fw-semibold small">{x.title}</div>
                    </div>
                    <div className="small text-muted">{x.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="alert alert-warning mt-3 mb-0 small">
              <i className="bi bi-exclamation-triangle me-2"></i>
              This tool is not medical advice. Always consult a qualified doctor.
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card-modern p-4 bg-white h-100">
            <h3 className="h6 fw-bold">What we analyze</h3>
            <ul className="small text-muted mb-0">
              <li>Lab values (when present)</li>
              <li>Imaging impressions and findings (USG, X-ray, etc.)</li>
              <li>Risk scoring and recommendations</li>
              <li>Diet & lifestyle suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;


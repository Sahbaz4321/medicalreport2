import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="col-12 col-md-6 col-lg-4">
    <div className="card-modern p-4 bg-white hover-lift h-100 border-0 shadow-lg">
      <div className="text-center mb-3">
        <div
          className="rounded-4 d-inline-flex align-items-center justify-content-center text-white mb-3"
          style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #0b5ed7, #20c997)',
            boxShadow: '0 10px 25px rgba(11, 94, 215, 0.25)'
          }}
        >
          <i className={`bi ${icon} fs-2`}></i>
        </div>
      </div>
      <h5 className="fw-bold text-center mb-2">{title}</h5>
      <p className="text-muted text-center mb-0">{desc}</p>
    </div>
  </div>
);

const StepCard = ({ step, title, icon, desc }) => (
  <div className="col-12 col-md-4">
    <div className="card-modern p-4 bg-white h-100 hover-lift border-0 shadow-lg position-relative">
      <div className="text-center">
        <div className="position-absolute top-0 start-50 translate-middle">
          <span className="badge bg-primary rounded-pill px-3 py-2 shadow-sm">Step {step}</span>
        </div>
        <div className="mt-4 mb-3">
          <div
            className="rounded-4 d-inline-flex align-items-center justify-content-center text-white"
            style={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, #0b5ed7, #20c997)',
              boxShadow: '0 10px 25px rgba(11, 94, 215, 0.25)'
            }}
          >
            <i className={`bi ${icon} fs-2`}></i>
          </div>
        </div>
        <h5 className="fw-bold mb-2">{title}</h5>
        <p className="text-muted mb-0">{desc}</p>
      </div>
      {step < 3 && (
        <div className="position-absolute top-50 end-0 translate-middle-y d-none d-md-block">
          <i className="bi bi-arrow-right text-muted fs-4"></i>
        </div>
      )}
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="fade-in">
      <section className="py-5">
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="fade-in">
                <p className="text-primary fw-semibold small mb-2">
                  AI‑powered healthcare dashboard
                </p>
                <h1 className="fw-bold mb-3" style={{ fontSize: '2.6rem' }}>
                  Understand your medical reports with <span className="text-primary">AI</span>
                </h1>
                <p className="lead text-muted mb-4">
                  Upload your report and get instant AI‑powered analysis, health insights, and
                  simplified explanations, all in a modern SaaS‑style dashboard.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-4">
                  <Link
                    to={user ? '/dashboard' : '/login'}
                    className="btn btn-primary btn-lg btn-glow rounded-pill px-4 py-3 text-decoration-none"
                  >
                    <i className="bi bi-cloud-arrow-up me-2"></i>
                    Upload Report
                  </Link>
                  <a
                    href="#features"
                    className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-3 text-decoration-none"
                  >
                    Try Demo
                  </a>
                </div>
                <div className="row g-3">
                  <div className="col-6 col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success fs-5"></i>
                      <span className="small fw-medium">OCR Extraction</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success fs-5"></i>
                      <span className="small fw-medium">AI Analysis</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success fs-5"></i>
                      <span className="small fw-medium">Voice Explanation</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success fs-5"></i>
                      <span className="small fw-medium">Smart Charts</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success fs-5"></i>
                      <span className="small fw-medium">AI Chatbot</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-check2-circle text-success fs-5"></i>
                      <span className="small fw-medium">Report History</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="border rounded-4 p-3 bg-white shadow-sm">
                <div className="row g-3">
                  <div className="col-12 col-md-5">
                    <div className="bg-light rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="small text-muted mb-1">Health score</div>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 text-success"
                            style={{ width: 56, height: 56 }}
                          >
                            <span className="fw-bold">82</span>
                          </div>
                          <div className="small text-muted">
                            <div className="fw-semibold text-dark">Low risk</div>
                            <div>Based on last report</div>
                          </div>
                        </div>
                      </div>
                      <div className="small text-muted mt-3">
                        <i className="bi bi-shield-check me-1 text-primary"></i>
                        AI‑assisted insights only; always consult your doctor.
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-7">
                    <div className="bg-light rounded-3 p-3 mb-3">
                      <div className="small text-muted mb-1">Key metrics</div>
                      <div className="d-flex align-items-end justify-content-between" style={{ height: 70 }}>
                        {[60, 80, 45, 70].map((v, i) => (
                          <div
                            key={i}
                            style={{
                              width: '18%',
                              borderRadius: 6,
                              background: 'linear-gradient(180deg,#0b5ed7,#20c997)',
                              opacity: 0.2 + i * 0.15,
                              height: `${v}%`,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-3 p-3 border small">
                      <div className="fw-semibold mb-1">AI summary</div>
                      <p className="mb-0 text-muted">
                        “Cholesterol and triglycerides are slightly higher than ideal. Improving diet,
                        activity, and follow‑up with your clinician is recommended.”
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">Powerful Features</h2>
            <p className="lead text-muted">Everything you need to understand your medical reports</p>
          </div>
          <div className="row g-4">
            <FeatureCard
              icon="bi-file-earmark-text"
              title="AI Medical Report Explanation"
              desc="Transform complex medical jargon into clear, easy-to-understand summaries tailored for you."
            />
            <FeatureCard
              icon="bi-speedometer2"
              title="Health Score Analysis"
              desc="Get a comprehensive 0-100 health score with color-coded risk assessment and personalized insights."
            />
            <FeatureCard
              icon="bi-bar-chart-line"
              title="Smart Graph Insights"
              desc="Visualize your health trends with interactive charts and graphs for better understanding."
            />
            <FeatureCard
              icon="bi-volume-up-fill"
              title="Voice Explanation"
              desc="Listen to AI-generated explanations with natural voice synthesis for hands-free learning."
            />
            <FeatureCard
              icon="bi-robot"
              title="AI Chatbot Assistant"
              desc="Ask questions about your report and get instant, contextual answers from our AI assistant."
            />
            <FeatureCard
              icon="bi-clock-history"
              title="Report History Management"
              desc="Track your health journey over time with comprehensive report history and trend analysis."
            />
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">How It Works</h2>
            <p className="lead text-muted">Three simple steps to better health understanding</p>
          </div>
          <div className="row g-4">
            <StepCard
              step={1}
              title="Upload Medical Report"
              icon="bi-cloud-arrow-up-fill"
              desc="Simply upload your medical report as a PDF or image file from any device."
            />
            <StepCard
              step={2}
              title="AI Analyzes Report"
              icon="bi-cpu-fill"
              desc="Our advanced AI extracts text, analyzes medical data, and generates comprehensive insights."
            />
            <StepCard
              step={3}
              title="View Health Insights"
              icon="bi-graph-up-arrow"
              desc="Get personalized health scores, charts, recommendations, and chat with our AI assistant."
            />
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-br from-primary-subtle to-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-primary mb-3">What Users Say</h2>
            <p className="lead text-muted">Trusted by patients and healthcare professionals</p>
          </div>
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="row g-4">
                {[
                  {
                    name: 'Sarah Johnson',
                    role: 'Patient',
                    quote: '"This AI analyzer helped me understand my blood test results without needing a medical degree. The visual charts made everything so clear!"',
                    rating: 5
                  },
                  {
                    name: 'Dr. Michael Chen',
                    role: 'Healthcare Professional',
                    quote: '"As a doctor, I appreciate how this tool empowers patients to understand their reports better. It saves me time explaining basic concepts."',
                    rating: 5
                  },
                ].map((t, idx) => (
                  <div className="col-12 col-md-6" key={idx}>
                    <div className="card-modern p-4 bg-white h-100 border-0 shadow-lg hover-lift">
                      <div className="d-flex mb-3">
                        {[...Array(t.rating)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill text-warning"></i>
                        ))}
                      </div>
                      <p className="text-muted mb-3">{t.quote}</p>
                      <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-2">
                          <i className="bi bi-person-fill text-primary fs-4"></i>
                        </div>
                        <div>
                          <div className="fw-semibold">{t.name}</div>
                          <div className="small text-muted">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card-modern p-4 bg-primary text-white h-100 border-0 shadow-xl">
                <div className="text-center">
                  <i className="bi bi-rocket-takeoff fs-1 mb-3"></i>
                  <h4 className="fw-bold mb-3">Ready to Get Started?</h4>
                  <p className="mb-4">
                    Join thousands of users who are already taking control of their health with AI-powered insights.
                  </p>
                  <Link 
                    to={user ? '/dashboard' : '/login'} 
                    className="btn btn-light btn-lg rounded-pill px-4 py-3 text-decoration-none w-100"
                  >
                    <i className="bi bi-lightning-charge me-2"></i>
                    Get Started Now
                  </Link>
                  <div className="mt-3 small">
                    <i className="bi bi-shield-check me-1"></i>
                    100% Secure & HIPAA Compliant
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


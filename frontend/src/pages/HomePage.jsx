import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const FeatureCard = ({ icon, title, desc }) => (
  <div className="col-12 col-md-6 col-lg-4">
    <div className="card-modern p-4 bg-white hover-lift h-100">
      <div className="d-flex align-items-center gap-3 mb-2">
        <div
          className="rounded-3 d-grid place-items-center text-primary"
          style={{
            width: 42,
            height: 42,
            background: 'rgba(13,110,253,0.10)',
          }}
        >
          <i className={`bi ${icon} fs-5`}></i>
        </div>
        <div className="fw-semibold">{title}</div>
      </div>
      <div className="text-muted small">{desc}</div>
    </div>
  </div>
);

const StepCard = ({ step, title, icon, desc }) => (
  <div className="col-12 col-md-4">
    <div className="card-modern p-4 bg-white h-100 hover-lift">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <span className="badge text-bg-primary">Step {step}</span>
        <i className={`bi ${icon} fs-4 text-primary`}></i>
      </div>
      <div className="fw-semibold mb-1">{title}</div>
      <div className="small text-muted">{desc}</div>
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="fade-in">
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-6">
              <div className="badge text-bg-primary mb-3">
                <i className="bi bi-shield-check me-1"></i>
                Hackathon-ready healthcare dashboard
              </div>
              <h1 className="display-6 fw-bold">
                AI Medical Report Analyzer
              </h1>
              <p className="lead text-muted mt-3">
                Upload your report (PDF or image), run OCR, and get a simplified explanation,
                abnormal findings, health insights, and beautiful charts—powered by AI.
              </p>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <Link
                  to={user ? '/dashboard' : '/login'}
                  className="btn btn-primary btn-lg btn-glow"
                >
                  <i className="bi bi-cloud-arrow-up me-2"></i>
                  Upload Report
                </Link>
                <Link to="/about" className="btn btn-outline-primary btn-lg">
                  Learn more
                </Link>
              </div>
              <div className="d-flex flex-wrap gap-3 mt-4 small text-muted">
                <span>
                  <i className="bi bi-check2-circle me-1 text-success"></i>
                  OCR extraction
                </span>
                <span>
                  <i className="bi bi-check2-circle me-1 text-success"></i>
                  AI summary & chat
                </span>
                <span>
                  <i className="bi bi-check2-circle me-1 text-success"></i>
                  Reports history
                </span>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card-modern p-4 bg-white">
                <div
                  className="rounded-4 p-4 text-white"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(11,94,215,1) 0%, rgba(32,201,151,1) 100%)',
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="small text-white-50">Today’s Snapshot</div>
                      <div className="fs-4 fw-semibold">Health Dashboard</div>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-3 px-3 py-2">
                      <i className="bi bi-activity fs-3"></i>
                    </div>
                  </div>
                  <div className="row g-3 mt-3">
                    <div className="col-6">
                      <div className="bg-white bg-opacity-10 rounded-3 p-3">
                        <div className="small text-white-50">Risk score</div>
                        <div className="fw-bold fs-3">72</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-white bg-opacity-10 rounded-3 p-3">
                        <div className="small text-white-50">Insights</div>
                        <div className="fw-bold fs-3">6</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="bg-white bg-opacity-10 rounded-3 p-3">
                        <div className="small text-white-50 mb-1">AI summary</div>
                        <div className="small">
                          “Your report suggests mild fatty liver and urinary stones. With hydration,
                          diet changes, and a specialist follow-up, this can be managed well.”
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 small text-muted">
                  Medical-themed UI with charts, voice, PDF export, and AI chat.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
              <h2 className="h4 fw-bold mb-1">Features</h2>
              <div className="text-muted small">Everything you need for report understanding.</div>
            </div>
          </div>
          <div className="row g-3">
            <FeatureCard
              icon="bi-file-earmark-text"
              title="AI Report Explanation"
              desc="Simplifies complex medical language into easy, actionable summaries."
            />
            <FeatureCard
              icon="bi-speedometer2"
              title="Health Score"
              desc="A clear 0–100 risk score with color-coded interpretation."
            />
            <FeatureCard
              icon="bi-bar-chart"
              title="Smart Graph Analysis"
              desc="Bar, pie, and trend views to understand what matters quickly."
            />
            <FeatureCard
              icon="bi-volume-up"
              title="Voice Explanation"
              desc="Play/pause/stop voice readout using SpeechSynthesis."
            />
            <FeatureCard
              icon="bi-chat-dots"
              title="AI Chatbot"
              desc="Ask questions about your report and get contextual answers."
            />
            <FeatureCard
              icon="bi-clock-history"
              title="Report History"
              desc="Track previous reports, download, and share insights."
            />
          </div>
        </div>
      </section>

      <section className="py-5 bg-white bg-opacity-50">
        <div className="container">
          <h2 className="h4 fw-bold mb-1">How it works</h2>
          <div className="text-muted small mb-3">Three simple steps.</div>
          <div className="row g-3">
            <StepCard
              step={1}
              title="Upload report"
              icon="bi-cloud-arrow-up"
              desc="Upload PDF/image report from your device."
            />
            <StepCard
              step={2}
              title="AI analyzes"
              icon="bi-cpu"
              desc="OCR extracts text. AI summarizes and extracts structured insights."
            />
            <StepCard
              step={3}
              title="View insights"
              icon="bi-graph-up-arrow"
              desc="See risk score, charts, recommendations, and chat answers."
            />
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <div className="card-modern p-4 bg-white">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-stars text-primary"></i>
                  <div className="fw-semibold">Testimonials</div>
                </div>
                <div className="row g-3">
                  {[
                    {
                      name: 'Student team',
                      quote:
                        '“This dashboard made our hackathon demo feel like a real healthcare product.”',
                    },
                    {
                      name: 'Busy patient',
                      quote:
                        '“Finally I can understand my report without Googling everything.”',
                    },
                  ].map((t, idx) => (
                    <div className="col-12 col-md-6" key={idx}>
                      <div className="border rounded-3 p-3 h-100">
                        <div className="small text-muted">{t.quote}</div>
                        <div className="small fw-semibold mt-2">{t.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="card-modern p-4 bg-white h-100 hover-lift">
                <div className="fw-semibold mb-1">Ready to try?</div>
                <div className="small text-muted mb-3">
                  Sign in and analyze your first report in seconds.
                </div>
                <Link to={user ? '/dashboard' : '/login'} className="btn btn-primary btn-glow">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Get started
                </Link>
                <div className="small text-muted mt-3">
                  Your data stays in your Firebase project.
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


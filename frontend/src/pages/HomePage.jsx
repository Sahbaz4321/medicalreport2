import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const gradientStyles = {
  'from-blue-500 to-blue-600': 'linear-gradient(135deg,#0b5ed7,#0a58ca)',
  'from-green-500 to-green-600': 'linear-gradient(135deg,#20c997,#0f9f6e)',
  'from-teal-500 to-teal-600': 'linear-gradient(135deg,#20c997,#0d9488)',
};

const HeroFeatureCard = ({ icon, title, description, gradient }) => (
  <div className="col-12 col-md-4 mt-3 mt-md-0">
    <div
      className="card-modern h-100 border-0 bg-white rounded-4"
      style={{
        boxShadow: '0 22px 45px rgba(15, 23, 42, 0.10)',
        transform: 'scale(1)',
        padding: '1.75rem',
        transition:
          'transform 0.5s cubic-bezier(0.16, 0.84, 0.44, 1), box-shadow 0.28s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.06)';
        e.currentTarget.style.boxShadow = '0 26px 55px rgba(15, 23, 42, 0.20)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 22px 45px rgba(15, 23, 42, 0.10)';
      }}
    >
      <div>
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-3 mb-4"
          style={{
            width: 44,
            height: 44,
            background: gradientStyles[gradient] || 'linear-gradient(135deg,#0b5ed7,#20c997)',
          }}
        >
          {icon}
        </div>
        <h5 className="fw-semibold mb-2 text-dark">{title}</h5>
        <p className="text-muted mb-0">{description}</p>
      </div>
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
      {/* Hero + Top Bar + Features */}
      <section id="features" className="py-5" style={{ background: 'linear-gradient(135deg,#f5fbff,#e6fff4)' }}>
        <div className="container" style={{ maxWidth: 1200 }}>
        
        
          {/* <div className="d-flex justify-content-between align-items-center mb-5">
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-3 d-inline-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg,#0b5ed7,#20c997)',
                }}
              >
                <i className="bi bi-file-medical text-white"></i>
              </div>
              <span className="fw-bold fs-5 text-dark">MedAnalyzer</span>
            </div>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="btn btn-primary rounded-pill px-4 py-2 btn-glow text-decoration-none"
            >
              Get Started
            </Link>
          </div> */}

          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3" style={{ fontSize: '2.8rem' }}>
              Transform Your Medical Reports
              <br />
              <span className="text-primary">Into Actionable Insights</span>
            </h1>
            <p className="lead text-muted mb-4">
              Upload your medical reports and get instant AI-powered analysis with easy-to-understand
              visualizations and risk assessments.
            </p>
            <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
              <Link
                to={user ? '/dashboard' : '/login'}
                className="d-inline-flex align-items-center gap-2 px-4 px-md-5 py-3 text-white text-decoration-none"
                style={{
                  borderRadius: 14,
                  backgroundImage: 'linear-gradient(90deg,#2563eb,#16a34a)',
                  boxShadow: '0 10px 22px rgba(37,99,235,0.30)',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  transition: 'box-shadow 0.22s ease, transform 0.22s ease',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(37,99,235,0.42)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 22px rgba(37,99,235,0.30)';
                }}
              >
                <span>Start Analyzing</span>
                <ArrowRight size={18} />
              </Link>
              {/* <a
                href="#how-it-works"
                className="btn btn-outline-secondary btn-lg rounded-pill px-4 py-3 text-decoration-none"
              >
                See How It Works
              </a> */}
            </div>
          </div>

          <div className="row gy-4 gx-4 gx-md-5 mb-5 mt-2">
            <HeroFeatureCard
              icon={<Zap className="w-5 h-5 text-white" />}
              title="Instant Analysis"
              description="Upload PDFs or images and get comprehensive analysis in seconds with our advanced OCR technology."
              gradient="from-blue-500 to-blue-600"
            />
            <HeroFeatureCard
              icon={<Shield className="w-5 h-5 text-white" />}
              title="Secure & Private"
              description="Your medical data is encrypted and stored securely. Only you have access to your reports."
              gradient="from-green-500 to-green-600"
            />
            <HeroFeatureCard
              icon={<TrendingUp className="w-5 h-5 text-white" />}
              title="Track Progress"
              description="Monitor your health metrics over time with interactive charts and detailed trend analysis."
              gradient="from-teal-500 to-teal-600"
            />
          </div>
        
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-primary fw-semibold small mb-2">Simple, Fast, and Secure</p>
            <h2 className="display-5 fw-bold text-primary mb-3">How It Works</h2>
            <p className="lead text-muted">
              Just three quick steps to turn complex reports into clear health insights.
            </p>
          </div>
          <div className="row g-4">
            <StepCard
              step={1}
              title="Upload Your Report"
              icon="bi-cloud-arrow-up-fill"
              desc="Drag and drop your medical report in PDF or image format from any device."
            />
            <StepCard
              step={2}
              title="AI Analysis"
              icon="bi-cpu-fill"
              desc="Our AI extracts text, analyzes key health metrics, and interprets your results automatically."
            />
            <StepCard
              step={3}
              title="View Insights"
              icon="bi-graph-up-arrow"
              desc="See clear visualizations, risk scores, and personalized health summaries."
            />
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-4">
        <div className="container text-center">
          <p className="small text-muted mb-0">
            <span className="fw-semibold">Educational Use Only:</span> This tool provides rule-based analysis
            for educational and demonstration purposes. It is not intended to provide medical advice. Always
            consult a healthcare professional for medical decisions.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;


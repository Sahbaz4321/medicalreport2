import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  return (
    <footer className="border-top mt-5">
      <div className="container py-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2">
              <span className="brand-mark" style={{ width: 32, height: 32, borderRadius: 10 }}>
                <i className="bi bi-heart-pulse-fill"></i>
              </span>
              <div>
                <div className="fw-semibold">AI Medical Report Analyzer</div>
                <div className="text-muted small">Simplify reports. See insights. Act smarter.</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="small fw-semibold mb-2">Links</div>
            <div className="d-flex flex-column gap-1 small">
              <Link to="/" className="text-decoration-none">
                Home
              </Link>
              <Link to="/about" className="text-decoration-none">
                About
              </Link>
              <Link to="/contact" className="text-decoration-none">
                Contact
              </Link>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className="small fw-semibold mb-2">Social</div>
            <div className="d-flex gap-2">
              <a className="btn btn-outline-secondary btn-sm" href="#" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a className="btn btn-outline-secondary btn-sm" href="#" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a className="btn btn-outline-secondary btn-sm" href="#" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-3" />
        <div className="d-flex flex-column flex-md-row justify-content-between small text-muted">
          <div>© {new Date().getFullYear()} AI Medical Report Analyzer</div>
          <div>Not medical advice. Always consult a doctor.</div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;


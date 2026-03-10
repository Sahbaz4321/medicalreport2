import React from 'react';
import { Link } from 'react-router-dom';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer mt-5 py-4">
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <i className="bi bi-heart-pulse-fill"></i>
              </div>
              <div>
                <div className="footer-title">AI Medical Report Analyzer</div>
                <div className="footer-subtitle">Simplify reports. See insights. Act smarter.</div>
              </div>
            </div>
            <p className="text-muted small mt-3" style={{ maxWidth: '300px' }}>
              Upload your medical reports and get AI-powered analysis to understand your health better. 
              Make informed decisions with personalized insights.
            </p>
          </div>

          {/* Links Column */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="footer-heading">Legal</h6>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="col-lg-4 col-md-12">
            <h6 className="footer-heading">Connect With Us</h6>
            <p className="text-muted small mb-3">
              Follow us on social media for health tips and updates.
            </p>
            <div className="social-links">
              <a className="social-btn" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a className="social-btn" href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a className="social-btn" href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a className="social-btn" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright-text mb-2 mb-md-0">
                © {currentYear} AI Medical Report Analyzer. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="disclaimer-text mb-0">
                <i className="bi bi-exclamation-triangle me-1"></i>
                Not medical advice. Always consult a qualified healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;


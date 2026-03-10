import React, { useState } from 'react';

const ContactPage = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container py-4 fade-in">
      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card-modern p-4 bg-white">
            <h2 className="h4 fw-bold mb-2">Contact Us</h2>
            <p className="text-muted">
              Have feedback or want to improve the project? Send a message.
            </p>
            {sent ? (
              <div className="alert alert-success small mb-0">
                <i className="bi bi-check2-circle me-2"></i>
                Message sent (demo). Thanks!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Name</label>
                    <input className="form-control" required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Email</label>
                    <input type="email" className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label small">Message</label>
                    <textarea className="form-control" rows="4" required />
                  </div>
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-primary btn-glow" type="submit">
                      <i className="bi bi-send me-2"></i>
                      Send
                    </button>
                    <a className="btn btn-outline-secondary" href="mailto:support@example.com">
                      <i className="bi bi-envelope me-2"></i>
                      Email
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
        <div className="col-12 col-lg-5">
          <div className="card-modern p-4 bg-white h-100">
            <h3 className="h6 fw-bold mb-2">Quick links</h3>
            <div className="d-flex flex-column gap-2 small">
              <div>
                <i className="bi bi-geo-alt me-2 text-primary"></i>
                Remote / Online
              </div>
              <div>
                <i className="bi bi-clock me-2 text-primary"></i>
                24/7 for hackathon demos
              </div>
              <div>
                <i className="bi bi-github me-2 text-primary"></i>
                Open-source friendly
              </div>
            </div>
            <hr />
            <div className="small text-muted">
              For production deployment, connect this form to a backend mail service.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


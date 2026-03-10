import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating Background Shapes */}
      <div className="auth-shapes">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
        <div className="auth-shape auth-shape-3"></div>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="auth-card">
              {/* Icon */}
              <div className="auth-icon">
                <i className="bi bi-box-arrow-in-right"></i>
              </div>

              {/* Title */}
              <h3 className="text-center fw-bold mb-2" style={{ color: '#1f2937' }}>
                Welcome Back
              </h3>
              <p className="text-center text-muted mb-4">
                Sign in to analyze and track your medical reports
              </p>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-4" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label-modern d-block">Email</label>
                  <div className="input-group input-group-modern">
                    <span className="input-group-text">
                      <i className="bi bi-envelope text-muted"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control form-control-modern"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-modern d-block">Password</label>
                  <div className="input-group input-group-modern">
                    <span className="input-group-text">
                      <i className="bi bi-lock text-muted"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-modern"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span 
                      className="input-group-text password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-auth w-100 btn-glow"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Signup Link */}
              <p className="text-center mt-4 mb-0">
                <span className="text-muted">Don't have an account?</span>{' '}
                <Link to="/signup" className="fw-semibold text-decoration-none">
                  Create one
                </Link>
              </p>

              {/* Back to Home */}
              <div className="text-center mt-3">
                <Link to="/" className="text-muted small text-decoration-none">
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


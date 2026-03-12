import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
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
    <div
      className="d-flex align-items-center justify-content-center px-3"
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #ecfeff 0%, #ffffff 40%, #dbeafe 100%)',
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4 p-md-5"
        style={{ maxWidth: 440, width: '100%' }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: 64,
              height: 64,
              background: '#06b6d4',
              boxShadow: '0 18px 35px rgba(8, 145, 178, 0.35)',
            }}
          >
            <LogIn className="text-white" size={32} />
          </div>
          <h1 className="fw-bold mb-1" style={{ color: '#111827' }}>
            Welcome Back
          </h1>
          <p className="text-muted mb-0">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-danger bg-opacity-10 border border-danger border-opacity-25 text-danger rounded-3 px-3 py-2 mb-4 small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label small fw-medium text-muted">Email</label>
            <div className="position-relative">
              <Mail
                size={18}
                className="position-absolute"
                style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control ps-5 py-2 border rounded-3"
                placeholder="Enter your email"
                style={{
                  borderColor: '#e5e7eb',
                  boxShadow: 'none',
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-medium text-muted">Password</label>
            <div className="position-relative">
              <Lock
                size={18}
                className="position-absolute"
                style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control ps-5 py-2 border rounded-3"
                placeholder="Enter your password"
                style={{
                  borderColor: '#e5e7eb',
                  boxShadow: 'none',
                }}
              />
              <button
                type="button"
                className="btn btn-sm border-0 position-absolute"
                style={{ right: 4, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-100 text-white fw-semibold py-2 rounded-3"
            style={{
              backgroundColor: '#06b6d4',
              boxShadow: '0 14px 30px rgba(8,145,178,0.35)',
              border: 'none',
            }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted mb-2 small">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="fw-semibold text-decoration-none"
              style={{ color: '#06b6d4' }}
            >
              Sign up
            </Link>
          </p>
          <Link to="/" className="small text-muted text-decoration-none">
            <i className="bi bi-arrow-left me-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


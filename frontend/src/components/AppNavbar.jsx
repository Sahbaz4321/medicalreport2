import React, { useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = useMemo(() => {
    const email = user?.email || '';
    return email ? email.slice(0, 2).toUpperCase() : 'ME';
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top nav-blur border-bottom shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <span className="brand-mark">
            <i className="bi bi-heart-pulse-fill"></i>
          </span>
          <span className="fw-bold">AI Medical Report Analyzer</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact Us
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {!user ? (
              <Link to="/login" className="btn btn-primary btn-sm btn-glow">
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Sign In
              </Link>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span
                    className="rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                    style={{
                      width: 26,
                      height: 26,
                      background: 'linear-gradient(135deg, #0b5ed7, #20c997)',
                      fontSize: 12,
                    }}
                  >
                    {initials}
                  </span>
                  <span className="d-none d-md-inline">{user.email}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <Link to="/reports" className="dropdown-item">
                      <i className="bi bi-folder2-open me-2"></i>
                      My Reports
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <i className="bi bi-person-circle me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;


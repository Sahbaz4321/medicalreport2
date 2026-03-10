import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/reports?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <style>
        {`
          .custom-navbar {
            backdrop-filter: blur(12px);
            background-color: rgba(255, 255, 255, 0.95);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          .custom-nav-link {
            color: #4b5563;
            font-weight: 500;
            padding: 0.6rem 1.2rem !important;
            margin: 0 0.2rem;
            border-radius: 0.5rem;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            text-decoration: none !important;
            position: relative;
            display: inline-block;
          }
          /* Remove default underline and add rectangle hover */
          .navbar-nav .nav-link {
            text-decoration: none !important;
          }
          .custom-nav-link:hover, .custom-nav-link.active {
            color: #0d6efd !important;
            background-color: #eff6ff !important;
            text-decoration: none !important;
            transform: translateY(-1px);
          }
          .search-container {
            position: relative;
            max-width: 250px;
            width: 100%;
          }
          .search-input {
            padding-left: 2.5rem;
            border-radius: 2rem;
            background-color: #f3f4f6;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            font-size: 0.95rem;
          }
          .search-input:focus {
            background-color: #ffffff;
            border-color: #0d6efd;
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
            outline: none;
          }
          .search-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
            pointer-events: none;
          }
          .profile-btn {
            padding: 0;
            border-radius: 50%;
            transition: all 0.3s ease;
            background: transparent;
            border: 2px solid transparent !important;
          }
          .profile-btn:hover {
            transform: scale(1.05);
            border-color: #0d6efd !important;
            box-shadow: 0 4px 12px rgba(13, 110, 253, 0.2);
          }
          .profile-btn:focus {
            outline: none;
            border-color: #0d6efd !important;
            box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
          }
          /* Custom dropdown styling to make it look "ek dam mast" */
          .custom-dropdown-menu {
            border: none;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            border-radius: 1rem;
            padding: 0.5rem;
            min-width: 240px;
            margin-top: 0.75rem !important;
            animation: fadeInDown 0.3s ease;
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .custom-dropdown-item {
            border-radius: 0.5rem;
            padding: 0.6rem 1rem;
            font-weight: 500;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            color: #4b5563;
          }
          .custom-dropdown-item:hover {
            background-color: #f3f4f6;
            color: #111827;
          }
          .logout-item {
            color: #dc2626;
            font-weight: 600;
          }
          .logout-item:hover {
            background-color: #fee2e2;
            color: #b91c1c;
          }
          /* Hide the default dropdown caret if present */
          .dropdown-toggle::after {
            display: none !important;
          }
        `}
      </style>
      <nav className="navbar navbar-expand-lg custom-navbar sticky-top py-2 py-lg-3">
        <div className="container-fluid px-3 px-lg-5">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center fw-bold text-primary" to="/">
            <i className="bi bi-heart-pulse-fill me-2 fs-3"></i>
            <span className="fs-4 d-none d-sm-inline">AI Medical Analyzer</span>
            <span className="fs-4 d-inline d-sm-none">AI Analyzer</span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 shadow-none p-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Items */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Left Menu */}
            <ul className="navbar-nav mx-auto mb-3 mb-lg-0 gap-1 gap-lg-2 mt-3 mt-lg-0 text-center">
              <li className="nav-item">
                <a className="nav-link custom-nav-link w-100" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link custom-nav-link w-100 ${isActive ? 'active' : ''}`} to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link custom-nav-link w-100 ${isActive ? 'active' : ''}`} to="/contact">
                  Contact
                </NavLink>
              </li>
            </ul>

            {/* Right Side */}
            <div className="d-flex align-items-center justify-content-center gap-3 flex-column flex-lg-row">
              
              {/* Search Bar - accessible for all */}
              <form className="search-container me-lg-2 w-100" onSubmit={handleSearch}>
                <i className="bi bi-search search-icon"></i>
                <input
                  type="search"
                  className="form-control search-input w-100"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {!user ? (
                <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 fw-medium shadow-sm w-100 w-lg-auto">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </Link>
              ) : (
                <div className="dropdown w-100 w-lg-auto text-center">
                  {/* Profile Icon */}
                  <button
                    className="btn border-0 profile-btn dropdown-toggle mt-2 mt-lg-0"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <img
                      src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      alt="profile"
                      width="45"
                      height="45"
                      className="rounded-circle object-fit-cover bg-white shadow-sm"
                    />
                  </button>

                  {/* Dropdown */}
                  <ul className="dropdown-menu dropdown-menu-end custom-dropdown-menu">
                    <li className="px-3 py-2 border-bottom mb-2">
                       <div className="d-flex align-items-center gap-3">
                         <img 
                           src={user?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                           alt="user" 
                           width="45" 
                           height="45" 
                           className="rounded-circle object-fit-cover shadow-sm border"
                         />
                         <div className="text-start">
                           <p className="mb-0 fw-bold text-dark">{user?.displayName || "My Profile"}</p>
                           <p className="mb-0 text-muted small text-truncate" style={{maxWidth: '160px'}}>{user?.email || "User Email"}</p>
                         </div>
                       </div>
                    </li>
                    <li>
                      <Link className="dropdown-item custom-dropdown-item" to="/profile">
                        <i className="bi bi-person-gear me-3 fs-5 text-primary"></i>
                        Profile Settings
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item custom-dropdown-item" to="/reports">
                        <i className="bi bi-folder2-open me-3 fs-5 text-success"></i>
                        My Reports
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider my-2" />
                    </li>
                    <li>
                      <button className="dropdown-item custom-dropdown-item logout-item w-100 text-start" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-3 fs-5"></i>
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
    </>
  );
};

export default AppNavbar;

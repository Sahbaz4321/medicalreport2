import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { database, dbRef, onValue } from "../services/firebaseClient";

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImgError, setProfileImgError] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [profileName, setProfileName] = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setProfilePhotoUrl(null);
      setProfileName(null);
      return;
    }
    const ref = dbRef(database, `users/${user.uid}/profile`);
    const unsub = onValue(ref, (snap) => {
      const data = snap.val() || {};
      setProfilePhotoUrl(data.photoUrl || null);
      setProfileName(data.fullName || data.displayName || null);
    });
    return () => unsub();
  }, [user?.uid]);

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
          @media (min-width: 768px) {
            .custom-navbar .navbar-collapse {
              display: flex !important;
              flex-basis: auto;
            }
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
      <nav className="navbar custom-navbar sticky-top py-2 py-lg-3">
        <div className="container-fluid px-3 px-lg-5">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center fw-bold text-primary" to="/">
            <i className="bi bi-heart-pulse-fill me-2 fs-3"></i>
            <span className="fs-4 d-none d-sm-inline">AI Medical Analyzer</span>
            <span className="fs-4 d-inline d-sm-none">AI Analyzer</span>
          </Link>

          {/* Desktop nav (md+) */}
          <div className="d-none d-md-flex align-items-center flex-grow-1">
            {/* Center: Features, About, Contact Us */}
            <ul className="navbar-nav mx-auto mb-0 gap-1 gap-md-2 align-items-center">
              <li className="nav-item">
                <a className="nav-link custom-nav-link" href="/#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active' : ''}`} to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({ isActive }) => `nav-link custom-nav-link ${isActive ? 'active' : ''}`} to="/contact">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {/* Right: Search + Sign In / Profile */}
            <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
              <form className="search-container" style={{ minWidth: 140 }} onSubmit={handleSearch}>
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
                <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2 fw-medium shadow-sm text-nowrap">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </Link>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn border-0 profile-btn dropdown-toggle p-0"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Profile menu"
                  >
                    {(profilePhotoUrl || (user.photoURL && !profileImgError)) ? (
                      <img
                        src={profilePhotoUrl || user.photoURL}
                        alt="profile"
                        width="45"
                        height="45"
                        className="rounded-circle object-fit-cover bg-white shadow-sm"
                        onError={() => setProfileImgError(true)}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary"
                        style={{ width: 45, height: 45, fontSize: '1rem' }}
                      >
                        {(user.displayName || user.email || 'U').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Dropdown */}
                  <ul className="dropdown-menu dropdown-menu-end custom-dropdown-menu">
                    <li className="px-3 py-2 border-bottom mb-2">
                      <div className="d-flex align-items-center gap-3">
                        {(profilePhotoUrl || (user.photoURL && !profileImgError)) ? (
                          <img
                            src={profilePhotoUrl || user.photoURL}
                            alt="user"
                            width="45"
                            height="45"
                            className="rounded-circle object-fit-cover shadow-sm border"
                          />
                        ) : (
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary"
                            style={{ width: 45, height: 45, fontSize: '1rem' }}
                          >
                            {(user.displayName || user.email || 'U').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="text-start">
                          <p className="mb-0 fw-bold text-dark">{user?.displayName || profileName || "My Profile"}</p>
                          <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: '160px' }}>{user?.email || "User Email"}</p>
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

          {/* Mobile menu (sm) */}
          <div className="d-flex d-md-none align-items-center gap-2 ms-auto">
            <button
              className="btn btn-outline-secondary rounded-pill px-3"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Open menu"
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end custom-dropdown-menu">
              <li>
                <a className="dropdown-item custom-dropdown-item" href="/#features">
                  <i className="bi bi-stars me-3 fs-5 text-primary"></i>
                  Features
                </a>
              </li>
              <li>
                <Link className="dropdown-item custom-dropdown-item" to="/about">
                  <i className="bi bi-info-circle me-3 fs-5 text-primary"></i>
                  About
                </Link>
              </li>
              <li>
                <Link className="dropdown-item custom-dropdown-item" to="/contact">
                  <i className="bi bi-telephone me-3 fs-5 text-primary"></i>
                  Contact Us
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider my-2" />
              </li>
              {!user ? (
                <li>
                  <Link className="dropdown-item custom-dropdown-item" to="/login">
                    <i className="bi bi-box-arrow-in-right me-3 fs-5 text-success"></i>
                    Sign In
                  </Link>
                </li>
              ) : (
                <>
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
                    <button className="dropdown-item custom-dropdown-item logout-item w-100 text-start" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-3 fs-5"></i>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Mobile: profile quick icon */}
            {user && (
              <Link to="/profile" className="text-decoration-none">
                {(profilePhotoUrl || (user.photoURL && !profileImgError)) ? (
                  <img
                    src={profilePhotoUrl || user.photoURL}
                    alt="profile"
                    width="40"
                    height="40"
                    className="rounded-circle object-fit-cover bg-white shadow-sm"
                    onError={() => setProfileImgError(true)}
                  />
                ) : (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary"
                    style={{ width: 40, height: 40, fontSize: '0.95rem' }}
                  >
                    {(user.displayName || user.email || 'U').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default AppNavbar;




// import React, { useEffect, useState } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../services/AuthContext";
// import { database, dbRef, onValue } from "../services/firebaseClient";

// const AppNavbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [profileImgError, setProfileImgError] = useState(false);
//   const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
//   const [profileName, setProfileName] = useState(null);

//   useEffect(() => {
//     if (!user?.uid) return;

//     const ref = dbRef(database, `users/${user.uid}/profile`);
//     const unsub = onValue(ref, (snap) => {
//       const data = snap.val() || {};
//       setProfilePhotoUrl(data.photoUrl || null);
//       setProfileName(data.fullName || data.displayName || null);
//     });

//     return () => unsub();
//   }, [user?.uid]);

//   const handleLogout = async () => {
//     await logout();
//     navigate("/");
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/reports?search=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <>
//       <style>{`
//         .custom-navbar{
//           backdrop-filter: blur(10px);
//           background: rgba(255,255,255,0.95);
//           border-bottom:1px solid rgba(0,0,0,0.05);
//         }

//         .custom-nav-link{
//           color:#4b5563;
//           font-weight:500;
//           padding:0.5rem 1rem;
//           border-radius:8px;
//           transition:all .25s;
//         }

//         .custom-nav-link:hover,
//         .custom-nav-link.active{
//           background:#eff6ff;
//           color:#0d6efd !important;
//         }

//         .search-container{
//           position:relative;
//           max-width:240px;
//           width:100%;
//         }

//         .search-input{
//           padding-left:2.2rem;
//           border-radius:30px;
//           background:#f3f4f6;
//           border:none;
//         }

//         .search-icon{
//           position:absolute;
//           left:12px;
//           top:50%;
//           transform:translateY(-50%);
//           color:#6b7280;
//         }

//         .profile-btn{
//           border:none;
//           background:none;
//         }

//         .custom-dropdown-menu{
//           border:none;
//           box-shadow:0 10px 25px rgba(0,0,0,0.1);
//           border-radius:12px;
//           padding:.5rem;
//         }

//       `}</style>

//       <nav className="navbar navbar-expand-md custom-navbar sticky-top py-2">
//         <div className="container-fluid px-3 px-lg-5">

//           {/* Logo */}
//           <Link className="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
//             <i className="bi bi-heart-pulse-fill me-2 fs-4"></i>
//             AI Medical Analyzer
//           </Link>

//           {/* Mobile Toggle */}
//           <button
//             className="navbar-toggler border-0"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarContent"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {/* Navbar Items */}
//           <div className="collapse navbar-collapse" id="navbarContent">

//             {/* Center menu */}
//             <ul className="navbar-nav mx-auto gap-2">
//               <li className="nav-item">
//                 <a className="nav-link custom-nav-link" href="/#features">
//                   Features
//                 </a>
//               </li>

//               <li className="nav-item">
//                 <NavLink className="nav-link custom-nav-link" to="/about">
//                   About
//                 </NavLink>
//               </li>

//               <li className="nav-item">
//                 <NavLink className="nav-link custom-nav-link" to="/contact">
//                   Contact
//                 </NavLink>
//               </li>
//             </ul>

//             {/* Right side */}
//             <div className="d-flex align-items-center gap-3">

//               {/* Search */}
//               <form className="search-container" onSubmit={handleSearch}>
//                 <i className="bi bi-search search-icon"></i>

//                 <input
//                   className="form-control search-input"
//                   placeholder="Search reports"
//                   value={searchQuery}
//                   onChange={(e)=>setSearchQuery(e.target.value)}
//                 />
//               </form>

//               {/* Login / Profile */}
//               {!user ? (

//                 <Link className="btn btn-primary rounded-pill px-4" to="/login">
//                   Sign In
//                 </Link>

//               ) : (

//                 <div className="dropdown">

//                   <button
//                     className="profile-btn dropdown-toggle"
//                     data-bs-toggle="dropdown"
//                   >
//                     {(profilePhotoUrl || user.photoURL) ? (
//                       <img
//                         src={profilePhotoUrl || user.photoURL}
//                         width="40"
//                         height="40"
//                         className="rounded-circle"
//                         onError={()=>setProfileImgError(true)}
//                       />
//                     ) : (
//                       <div
//                         className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
//                         style={{width:40,height:40}}
//                       >
//                         {(user.email || "U")[0].toUpperCase()}
//                       </div>
//                     )}
//                   </button>

//                   <ul className="dropdown-menu dropdown-menu-end custom-dropdown-menu">

//                     <li className="px-3 py-2 border-bottom">
//                       <strong>{profileName || user.displayName || "User"}</strong>
//                       <div className="small text-muted">{user.email}</div>
//                     </li>

//                     <li>
//                       <Link className="dropdown-item" to="/profile">
//                         Profile Settings
//                       </Link>
//                     </li>

//                     <li>
//                       <Link className="dropdown-item" to="/reports">
//                         My Reports
//                       </Link>
//                     </li>

//                     <li><hr/></li>

//                     <li>
//                       <button className="dropdown-item text-danger" onClick={handleLogout}>
//                         Logout
//                       </button>
//                     </li>

//                   </ul>

//                 </div>

//               )}

//             </div>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default AppNavbar;
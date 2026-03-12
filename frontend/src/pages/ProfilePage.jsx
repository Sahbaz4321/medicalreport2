import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { database, dbRef, onValue, update } from "../services/firebaseClient";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, lastReportDate: null });

  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");

  useEffect(() => {
    if (!user) return;

    const profileRef = dbRef(database, `users/${user.uid}/profile`);

    const unsubProfile = onValue(profileRef, (snap) => {
      const val = snap.val() || {};
      setProfile(val);

      setFullName(val.fullName || "");
      setGender(val.gender || "");
      setDob(val.dob || "");
      setLocation(val.location || "");
      setPhotoUrl(val.photoUrl || "");
      setBloodGroup(val.bloodGroup || "");
      setHeightCm(val.heightCm || "");
      setWeightKg(val.weightKg || "");
      setAllergies(val.allergies || "");
      setMedicalConditions(val.medicalConditions || "");
    });

    const reportsRef = dbRef(database, `users/${user.uid}/reports`);

    const unsubReports = onValue(reportsRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.entries(val)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setReports(list);

      const last = list[0];

      setStats({
        total: list.length,
        lastReportDate: last?.createdAt || null,
      });
    });

    return () => {
      unsubProfile();
      unsubReports();
    };
  }, [user]);

  const bmi = useMemo(() => {
    const h = parseFloat(heightCm);
    const w = parseFloat(weightKg);

    if (!h || !w) return null;

    const meters = h / 100;
    const value = w / (meters * meters);

    return Number(value.toFixed(1));
  }, [heightCm, weightKg]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!user) return;

    setSaving(true);

    await update(dbRef(database, `users/${user.uid}/profile`), {
      fullName,
      gender,
      dob,
      location,
      photoUrl,
      bloodGroup,
      heightCm,
      weightKg,
      bmi,
      allergies,
      medicalConditions,
      updatedAt: Date.now(),
    });

    setSaving(false);
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString();
  };
  
  const formatReportDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRiskBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'risk-high bg-danger';
      case 'Medium': return 'risk-medium bg-warning';
      default: return 'risk-low bg-success';
    }
  };

  const handleSelectExisting = (report) => {
    navigate(`/report/${report.id}`);
  };

  const initials = useMemo(() => {
    const base = fullName || user?.email || "";
    return base.slice(0, 2).toUpperCase();
  }, [fullName]);

  return (
    <div className="container py-4">

      <div className="row g-4">

        {/* LEFT PROFILE CARD */}

        <div className="col-lg-4">

          <div className="card shadow border-0 text-center p-4">

            {photoUrl ? (
              <img
                src={photoUrl}
                alt="profile"
                className="rounded-circle mx-auto mb-3"
                style={{ width: 120, height: 120, objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-white"
                style={{
                  width: 120,
                  height: 120,
                  background: "linear-gradient(135deg,#0d6efd,#20c997)",
                  fontSize: 32,
                  fontWeight: "bold",
                }}
              >
                {initials}
              </div>
            )}

            <h4>{fullName || "Your Name"}</h4>
            <p className="text-muted">{user?.email}</p>

            <div className="row mt-3">

              <div className="col-6">
                <h5 className="text-primary">{stats.total}</h5>
                <small className="text-muted">Reports</small>
              </div>

              <div className="col-6">
                <h6>{formatDate(stats.lastReportDate)}</h6>
                <small className="text-muted">Last Upload</small>
              </div>

            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}

        <div className="col-lg-8">

          {/* PERSONAL INFO */}

          <div className="card shadow border-0 mb-4 p-4">

            <h5 className="mb-3">Personal Information</h5>

            <div className="row g-3">

              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">DOB</label>
                <input
                  type="date"
                  className="form-control"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

            </div>

          </div>

          {/* HEALTH INFO */}

          <div className="card shadow border-0 mb-4 p-4">

            <h5 className="mb-3">Health Information</h5>

            <div className="row g-3">

              <div className="col-md-3">
                <label className="form-label">Blood Group</label>
                <input
                  className="form-control"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Height (cm)</label>
                <input
                  className="form-control"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Weight (kg)</label>
                <input
                  className="form-control"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">BMI</label>
                <div className="fw-bold pt-2">
                  {bmi ? bmi : "—"}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Allergies</label>
                <input
                  className="form-control"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Medical Conditions</label>
                <input
                  className="form-control"
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                />
              </div>

            </div>

          </div>

          {/* SAVE BUTTON */}

          <div className="card shadow border-0 p-4 mb-4">

            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>

          </div>
          
          {/* RECENT MEDICAL REPORTS */}
          <div className="card shadow border-0 mb-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0">Recent Analyses</h5>
              <span className="badge bg-secondary rounded-pill">{reports.length} total</span>
            </div>
            
            {reports.length === 0 ? (
              <div className="empty-state text-center py-5 d-flex flex-column justify-content-center">
                <div className="empty-icon mb-3 mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: 60, height: 60}}>
                  <i className="bi bi-folder-x fs-2 text-muted"></i>
                </div>
                <h6 className="fw-bold mb-1">No reports yet</h6>
                <p className="text-muted small mb-0 px-4">Your analyzed history will appear here once you upload your first report on the Dashboard.</p>
                <button className="btn btn-outline-primary mt-3 btn-sm mx-auto" onClick={() => navigate('/dashboard')}>
                   <i className="bi bi-cloud-arrow-up me-2"></i>Upload Now
                </button>
              </div>
            ) : (
              <div className="reports-list pe-2" style={{maxHeight: '400px', overflowY: 'auto'}}>
                {reports.slice(0, 10).map((r, index) => (
                  <div
                    key={r.id}
                    className="report-item p-3 mb-3 bg-light rounded-4 border-0 hover-lift d-flex align-items-center cursor-pointer shadow-sm text-decoration-none"
                    onClick={() => handleSelectExisting(r)}
                    style={{animationDelay: `${index * 50}ms`, transition: 'all 0.3s'}}
                  >
                    <div className="report-icon bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48, flexShrink: 0}}>
                      <i className="bi bi-file-earmark-medical text-primary fs-5"></i>
                    </div>
                    <div className="report-info flex-grow-1 overflow-hidden me-2">
                       <div className="report-name fw-semibold text-dark text-truncate mb-1">
                          {r.fileName || 'Medical Report'}
                       </div>
                       <div className="report-meta d-flex align-items-center small text-muted">
                          <i className="bi bi-calendar-event me-1"></i>
                          <span className="report-date">{formatReportDate(r.createdAt)}</span>
                       </div>
                    </div>
                    <div className="report-risk ms-auto">
                       <span className={`badge rounded-pill px-3 py-2 ${getRiskBadgeClass(r.analysis?.riskLevel)}`}>
                          {r.analysis?.riskScore ? `${r.analysis.riskScore}/100` : 'View'}
                       </span>
                    </div>
                  </div>
                ))}
                {reports.length > 10 && (
                  <div className="text-center mt-3 pt-2">
                    <button onClick={() => navigate('/reports')} className="btn btn-sm btn-link text-decoration-none fw-semibold">
                      View All History <i className="bi bi-arrow-right ms-1"></i>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;











// import React, { useEffect, useMemo, useState } from 'react';
// import { useAuth } from '../services/AuthContext';
// import { database, dbRef, onValue, update } from '../services/firebaseClient';
// import { SkeletonLine } from '../components/Skeleton';

// function formatDate(ts) {
//   try {
//     if (!ts) return '—';
//     return new Date(ts).toLocaleString();
//   } catch {
//     return '—';
//   }
// }

// const ProfilePage = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState(null);
//   const [stats, setStats] = useState({ total: 0, lastReportDate: null });
//   const [saving, setSaving] = useState(false);

//   // Profile form fields
//   const [fullName, setFullName] = useState('');
//   const [gender, setGender] = useState('');
//   const [dob, setDob] = useState('');
//   const [location, setLocation] = useState('');
//   const [photoUrl, setPhotoUrl] = useState('');
//   const [useAvatar, setUseAvatar] = useState(false);
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [heightCm, setHeightCm] = useState('');
//   const [weightKg, setWeightKg] = useState('');
//   const [allergies, setAllergies] = useState('');
//   const [medicalConditions, setMedicalConditions] = useState('');

//   useEffect(() => {
//     if (!user) return;

//     const profileRef = dbRef(database, `users/${user.uid}/profile`);
//     const unsubProfile = onValue(profileRef, (snap) => {
//       const val = snap.val() || {};
//       setProfile(val);
//       setFullName(val.fullName || val.displayName || user?.displayName || '');
//       setGender(val.gender || '');
//       setDob(val.dob || '');
//       setLocation(val.location || '');
//       setPhotoUrl(val.photoUrl || '');
//       setUseAvatar(!val.photoUrl);
//       setBloodGroup(val.bloodGroup || '');
//       setHeightCm(val.heightCm || '');
//       setWeightKg(val.weightKg || '');
//       setAllergies(val.allergies || '');
//       setMedicalConditions(val.medicalConditions || '');
//     });

//     const reportsRef = dbRef(database, `users/${user.uid}/reports`);
//     const unsubReports = onValue(reportsRef, (snap) => {
//       const val = snap.val() || {};
//       const list = Object.values(val);
//       const last = list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
//       setStats({ total: list.length, lastReportDate: last?.createdAt || null });
//     });

//     return () => {
//       unsubProfile();
//       unsubReports();
//     };
//   }, [user]);

//   const initials = useMemo(() => {
//     const base = fullName || user?.email || '';
//     return base ? base.slice(0, 2).toUpperCase() : 'ME';
//   }, [fullName, user]);

//   const bmi = useMemo(() => {
//     const h = parseFloat(heightCm);
//     const w = parseFloat(weightKg);
//     if (!h || !w) return null;
//     const meters = h / 100;
//     if (!meters) return null;
//     const value = w / (meters * meters);
//     if (!Number.isFinite(value)) return null;
//     return Number(value.toFixed(1));
//   }, [heightCm, weightKg]);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!user) return;
//     setSaving(true);
//     await update(dbRef(database, `users/${user.uid}/profile`), {
//       displayName: fullName || user.email,
//       fullName: fullName || user.email,
//       gender,
//       dob,
//       location,
//       photoUrl: useAvatar ? '' : photoUrl || '',
//       avatarPreference: useAvatar ? 'avatar' : 'photo',
//       bloodGroup,
//       heightCm,
//       weightKg,
//       bmi: bmi || null,
//       allergies,
//       medicalConditions,
//       updatedAt: Date.now(),
//     });
//     setSaving(false);
//   };

//   return (
//     <div className="container-fluid py-4 fade-in">
//       <div className="row g-4">
//         {/* Profile Card */}
//         <div className="col-12 col-lg-4">
//           <div className="card-modern p-4 bg-white border-0 shadow-lg">
//             <div className="text-center mb-4">
//               {photoUrl ? (
//                 <img
//                   src={photoUrl}
//                   alt="Profile"
//                   className="rounded-circle border border-3 border-primary border-opacity-25 mb-3"
//                   style={{ width: 120, height: 120, objectFit: 'cover' }}
//                 />
//               ) : (
//                 <div
//                   className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
//                   style={{
//                     width: 120,
//                     height: 120,
//                     background: 'linear-gradient(135deg, #0b5ed7, #20c997)',
//                     fontWeight: 700,
//                     fontSize: 36,
//                   }}
//                 >
//                   {initials}
//                 </div>
//               )}
//               <h4 className="fw-bold mb-1">{fullName || profile?.displayName || 'Your Profile'}</h4>
//               <p className="text-muted mb-1">{user?.email}</p>
//               {location && <p className="text-muted small mb-3">{location}</p>}
//               <div className="d-flex justify-content-center gap-2">
//                 <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
//                   <i className="bi bi-person-check me-1"></i>
//                   Verified User
//                 </span>
//                 <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
//                   <i className="bi bi-shield-check me-1"></i>
//                   HIPAA Compliant
//                 </span>
//               </div>
//             </div>

//             <div className="border-top pt-3">
//               <h6 className="fw-bold mb-3">Health Statistics</h6>
//               <div className="row g-3">
//                 <div className="col-6">
//                   <div className="card-modern border-0 shadow-sm p-3 bg-gradient-to-br from-primary-subtle to-white text-center">
//                     <div className="rounded-circle bg-primary bg-opacity-10 p-2 mx-auto mb-2" style={{width: '40px', height: '40px'}}>
//                       <i className="bi bi-file-earmark-medical text-primary"></i>
//                     </div>
//                     <div className="fs-4 fw-bold text-primary">{stats.total}</div>
//                     <div className="small text-muted">Total Reports</div>
//                   </div>
//                 </div>
//                 <div className="col-6">
//                   <div className="card-modern border-0 shadow-sm p-3 bg-gradient-to-br from-success-subtle to-white text-center">
//                     <div className="rounded-circle bg-success bg-opacity-10 p-2 mx-auto mb-2" style={{width: '40px', height: '40px'}}>
//                       <i className="bi bi-calendar-check text-success"></i>
//                     </div>
//                     <div className="small fw-bold text-success">{formatDate(stats.lastReportDate)}</div>
//                     <div className="small text-muted">Last Report</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Right column - details + edit form */}
//         <div className="col-12 col-lg-8">
//           {/* Personal Information */}
//           <div className="card-modern p-4 bg-white border-0 shadow-lg mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="fw-bold mb-0">Personal Information</h5>
//               <span className="badge bg-light text-muted">
//                 <i className="bi bi-shield-lock me-1"></i>
//                 Private
//               </span>
//             </div>
//             <div className="row g-4">
//               <div className="col-12 col-md-6">
//                 <div className="small text-muted">Full Name</div>
//                 <div className="fw-semibold">{fullName || '—'}</div>
//               </div>
//               <div className="col-12 col-md-6">
//                 <div className="small text-muted">Date of Birth</div>
//                 <div className="fw-semibold">{dob || '—'}</div>
//               </div>
//               <div className="col-12 col-md-6">
//                 <div className="small text-muted">Gender</div>
//                 <div className="fw-semibold">{gender || '—'}</div>
//               </div>
//               <div className="col-12 col-md-6">
//                 <div className="small text-muted">Location</div>
//                 <div className="fw-semibold">{location || '—'}</div>
//               </div>
//             </div>
//           </div>

//           {/* Health Information */}
//           <div className="card-modern p-4 bg-white border-0 shadow-lg mb-4">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h5 className="fw-bold mb-0">Health Information</h5>
//             </div>
//             <div className="row g-4">
//               <div className="col-6 col-md-3">
//                 <div className="small text-muted">Blood Group</div>
//                 <div className="fw-semibold text-danger">{bloodGroup || '—'}</div>
//               </div>
//               <div className="col-6 col-md-3">
//                 <div className="small text-muted">Height (cm)</div>
//                 <div className="fw-semibold">{heightCm || '—'}</div>
//               </div>
//               <div className="col-6 col-md-3">
//                 <div className="small text-muted">Weight (kg)</div>
//                 <div className="fw-semibold">{weightKg || '—'}</div>
//               </div>
//               <div className="col-6 col-md-3">
//                 <div className="small text-muted">BMI</div>
//                 <div className="fw-semibold">
//                   {bmi ? (
//                     <>
//                       <span className="text-success">{bmi}</span>{' '}
//                       <span className="text-muted small">Normal</span>
//                     </>
//                   ) : (
//                     '—'
//                   )}
//                 </div>
//               </div>
//               <div className="col-12 col-md-6">
//                 <div className="small text-muted">Allergies</div>
//                 <div className="fw-semibold">{allergies || 'None'}</div>
//               </div>
//               <div className="col-12 col-md-6">
//                 <div className="small text-muted">Medical Conditions</div>
//                 <div className="fw-semibold">{medicalConditions || 'None'}</div>
//               </div>
//             </div>
//           </div>

//           {/* Medical Report Summary */}
//           <div className="card-modern p-4 bg-white border-0 shadow-lg">
//             <h5 className="fw-bold mb-3">Medical Report Summary</h5>
//             <div className="row g-3">
//               <div className="col-12 col-md-4">
//                 <div className="card-modern border-0 bg-light p-3 text-center h-100">
//                   <div className="small text-muted mb-1">Total Reports</div>
//                   <div className="fs-4 fw-bold text-primary">{stats.total}</div>
//                 </div>
//               </div>
//               <div className="col-12 col-md-4">
//                 <div className="card-modern border-0 bg-light p-3 text-center h-100">
//                   <div className="small text-muted mb-1">Avg Health Score</div>
//                   <div className="fs-5 fw-bold text-success">—</div>
//                 </div>
//               </div>
//               <div className="col-12 col-md-4">
//                 <div className="card-modern border-0 bg-light p-3 text-center h-100">
//                   <div className="small text-muted mb-1">Last Upload</div>
//                   <div className="small fw-semibold">{formatDate(stats.lastReportDate)}</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Edit form */}
//           <div className="card-modern p-4 bg-white border-0 shadow-lg mt-4">
//             <div className="d-flex align-items-center mb-3">
//               <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
//                 <i className="bi bi-pencil-square text-primary fs-5"></i>
//               </div>
//               <h5 className="fw-bold mb-0">Edit Profile</h5>
//             </div>
//             <p className="text-muted mb-4">
//               Add or update your personal and health details. These details are stored securely in your
//               account.
//             </p>

//             {!profile ? (
//               <div className="text-center py-3">
//                 <div className="spinner-border text-primary" role="status">
//                   <span className="visually-hidden">Loading...</span>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleSave}>
//                 <div className="row g-3">
//                   <div className="col-12 col-md-6">
//                     <label className="form-label small text-muted">Full Name</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   <div className="col-12 col-md-3">
//                     <label className="form-label small text-muted">Gender</label>
//                     <select
//                       className="form-select form-select-sm bg-light border-0"
//                       value={gender}
//                       onChange={(e) => setGender(e.target.value)}
//                     >
//                       <option value="">Select</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                   <div className="col-12 col-md-3">
//                     <label className="form-label small text-muted">Date of Birth</label>
//                     <input
//                       type="date"
//                       className="form-control form-control-sm bg-light border-0"
//                       value={dob}
//                       onChange={(e) => setDob(e.target.value)}
//                     />
//                   </div>
//                   <div className="col-12">
//                     <label className="form-label small text-muted">Location</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={location}
//                       onChange={(e) => setLocation(e.target.value)}
//                       placeholder="City, Country"
//                     />
//                   </div>

//                   <div className="col-12">
//                     <label className="form-label small text-muted me-3">Profile Image</label>
//                     <div className="d-flex align-items-center gap-3 mb-2">
//                       <div className="form-check form-check-inline">
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           id="profilePhoto"
//                           checked={!useAvatar}
//                           onChange={() => setUseAvatar(false)}
//                         />
//                         <label className="form-check-label small" htmlFor="profilePhoto">
//                           Use photo URL
//                         </label>
//                       </div>
//                       <div className="form-check form-check-inline">
//                         <input
//                           className="form-check-input"
//                           type="radio"
//                           id="profileAvatar"
//                           checked={useAvatar}
//                           onChange={() => setUseAvatar(true)}
//                         />
//                         <label className="form-check-label small" htmlFor="profileAvatar">
//                           Use avatar (initials)
//                         </label>
//                       </div>
//                     </div>
//                     {!useAvatar && (
//                       <input
//                         className="form-control form-control-sm bg-light border-0"
//                         value={photoUrl}
//                         onChange={(e) => setPhotoUrl(e.target.value)}
//                         placeholder="https://example.com/photo.jpg"
//                       />
//                     )}
//                   </div>

//                   <div className="col-6 col-md-3">
//                     <label className="form-label small text-muted">Blood Group</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={bloodGroup}
//                       onChange={(e) => setBloodGroup(e.target.value)}
//                       placeholder="O+"
//                     />
//                   </div>
//                   <div className="col-6 col-md-3">
//                     <label className="form-label small text-muted">Height (cm)</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={heightCm}
//                       onChange={(e) => setHeightCm(e.target.value)}
//                       placeholder="175"
//                     />
//                   </div>
//                   <div className="col-6 col-md-3">
//                     <label className="form-label small text-muted">Weight (kg)</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={weightKg}
//                       onChange={(e) => setWeightKg(e.target.value)}
//                       placeholder="72"
//                     />
//                   </div>
//                   <div className="col-6 col-md-3 d-flex align-items-end">
//                     <div className="small text-muted">
//                       BMI (auto){' '}
//                       <span className="fw-semibold ms-1">{bmi ? `${bmi}` : '—'}</span>
//                     </div>
//                   </div>

//                   <div className="col-12 col-md-6">
//                     <label className="form-label small text-muted">Allergies</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={allergies}
//                       onChange={(e) => setAllergies(e.target.value)}
//                       placeholder="Peanuts, Dust"
//                     />
//                   </div>
//                   <div className="col-12 col-md-6">
//                     <label className="form-label small text-muted">Medical Conditions</label>
//                     <input
//                       className="form-control form-control-sm bg-light border-0"
//                       value={medicalConditions}
//                       onChange={(e) => setMedicalConditions(e.target.value)}
//                       placeholder="None"
//                     />
//                   </div>

//                   <div className="col-12">
//                     <div className="d-flex flex-wrap gap-2 mt-2">
//                       <button
//                         className="btn btn-primary btn-sm rounded-pill px-4"
//                         disabled={saving}
//                         type="submit"
//                       >
//                         {saving ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2"></span>
//                             Saving...
//                           </>
//                         ) : (
//                           <>
//                             <i className="bi bi-save me-2"></i>
//                             Save Changes
//                           </>
//                         )}
//                       </button>
//                       <button
//                         type="button"
//                         className="btn btn-outline-secondary btn-sm rounded-pill px-4"
//                         onClick={() => {
//                           if (!profile) return;
//                           setFullName(profile.fullName || profile.displayName || '');
//                           setGender(profile.gender || '');
//                           setDob(profile.dob || '');
//                           setLocation(profile.location || '');
//                           setPhotoUrl(profile.photoUrl || '');
//                           setUseAvatar(!profile.photoUrl);
//                           setBloodGroup(profile.bloodGroup || '');
//                           setHeightCm(profile.heightCm || '');
//                           setWeightKg(profile.weightKg || '');
//                           setAllergies(profile.allergies || '');
//                           setMedicalConditions(profile.medicalConditions || '');
//                         }}
//                       >
//                         <i className="bi bi-arrow-clockwise me-2"></i>
//                         Reset
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


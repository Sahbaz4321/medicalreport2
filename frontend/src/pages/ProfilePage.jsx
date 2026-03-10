import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { database, dbRef, onValue, update } from '../services/firebaseClient';
import { SkeletonLine } from '../components/Skeleton';

function formatDate(ts) {
  try {
    if (!ts) return '—';
    return new Date(ts).toLocaleString();
  } catch {
    return '—';
  }
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, lastReportDate: null });
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (!user) return;

    const profileRef = dbRef(database, `users/${user.uid}/profile`);
    const unsubProfile = onValue(profileRef, (snap) => {
      const val = snap.val() || {};
      setProfile(val);
      setName(val.displayName || '');
      setPhotoUrl(val.photoUrl || '');
    });

    const reportsRef = dbRef(database, `users/${user.uid}/reports`);
    const unsubReports = onValue(reportsRef, (snap) => {
      const val = snap.val() || {};
      const list = Object.values(val);
      const last = list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))[0];
      setStats({ total: list.length, lastReportDate: last?.createdAt || null });
    });

    return () => {
      unsubProfile();
      unsubReports();
    };
  }, [user]);

  const initials = useMemo(() => {
    const base = name || user?.email || '';
    return base ? base.slice(0, 2).toUpperCase() : 'ME';
  }, [name, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await update(dbRef(database, `users/${user.uid}/profile`), {
      displayName: name || user.email,
      photoUrl: photoUrl || '',
      updatedAt: Date.now(),
    });
    setSaving(false);
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-12 col-lg-4">
          <div className="card-modern p-4 bg-white border-0 shadow-lg">
            <div className="text-center mb-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="rounded-circle border border-3 border-primary border-opacity-25 mb-3"
                  style={{ width: 120, height: 120, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                  style={{
                    width: 120,
                    height: 120,
                    background: 'linear-gradient(135deg, #0b5ed7, #20c997)',
                    fontWeight: 700,
                    fontSize: 36,
                  }}
                >
                  {initials}
                </div>
              )}
              <h4 className="fw-bold mb-1">{profile?.displayName || 'Your Profile'}</h4>
              <p className="text-muted mb-3">{user?.email}</p>
              <div className="d-flex justify-content-center gap-2">
                <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2">
                  <i className="bi bi-person-check me-1"></i>
                  Verified User
                </span>
                <span className="badge bg-success bg-opacity-10 text-success px-3 py-2">
                  <i className="bi bi-shield-check me-1"></i>
                  HIPAA Compliant
                </span>
              </div>
            </div>

            <div className="border-top pt-3">
              <h6 className="fw-bold mb-3">Health Statistics</h6>
              <div className="row g-3">
                <div className="col-6">
                  <div className="card-modern border-0 shadow-sm p-3 bg-gradient-to-br from-primary-subtle to-white text-center">
                    <div className="rounded-circle bg-primary bg-opacity-10 p-2 mx-auto mb-2" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-file-earmark-medical text-primary"></i>
                    </div>
                    <div className="fs-4 fw-bold text-primary">{stats.total}</div>
                    <div className="small text-muted">Total Reports</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card-modern border-0 shadow-sm p-3 bg-gradient-to-br from-success-subtle to-white text-center">
                    <div className="rounded-circle bg-success bg-opacity-10 p-2 mx-auto mb-2" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-calendar-check text-success"></i>
                    </div>
                    <div className="small fw-bold text-success">{formatDate(stats.lastReportDate)}</div>
                    <div className="small text-muted">Last Report</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="col-12 col-lg-8">
          <div className="card-modern p-4 bg-white border-0 shadow-lg">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                <i className="bi bi-gear-fill text-primary fs-5"></i>
              </div>
              <h5 className="fw-bold mb-0">Profile Settings</h5>
            </div>
            <p className="text-muted mb-4">
              Update your display name and profile picture to personalize your health dashboard.
            </p>

            {!profile ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading profile information...</p>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                      <i className="bi bi-person me-1"></i>
                      Display Name
                    </label>
                    <input
                      className="form-control form-control-lg border-0 bg-light"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-medium">
                      <i className="bi bi-image me-1"></i>
                      Profile Picture URL
                    </label>
                    <input
                      className="form-control form-control-lg border-0 bg-light"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary btn-glow rounded-pill px-4 py-2" disabled={saving}>
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Saving Changes...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-save me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4 py-2"
                        onClick={() => {
                          setName(profile.displayName || '');
                          setPhotoUrl(profile.photoUrl || '');
                        }}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Additional Settings Card */}
          <div className="card-modern p-4 bg-white border-0 shadow-lg mt-4">
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-info bg-opacity-10 p-2 me-2">
                <i className="bi bi-shield-lock text-info fs-5"></i>
              </div>
              <h5 className="fw-bold mb-0">Privacy & Security</h5>
            </div>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="card-modern border-0 shadow-sm p-3 bg-light">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-lock text-primary me-2"></i>
                    <div>
                      <div className="fw-medium small">Data Encryption</div>
                      <div className="text-muted small">End-to-end encrypted</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-modern border-0 shadow-sm p-3 bg-light">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-shield-check text-success me-2"></i>
                    <div>
                      <div className="fw-medium small">HIPAA Compliance</div>
                      <div className="text-muted small">Healthcare standards</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-modern border-0 shadow-sm p-3 bg-light">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-database text-info me-2"></i>
                    <div>
                      <div className="fw-medium small">Secure Storage</div>
                      <div className="text-muted small">Firebase secure</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="card-modern border-0 shadow-sm p-3 bg-light">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-eye-slash text-warning me-2"></i>
                    <div>
                      <div className="fw-medium small">Privacy Controls</div>
                      <div className="text-muted small">You own your data</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


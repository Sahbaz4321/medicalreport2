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
    <div className="container py-4 fade-in">
      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <div className="card-modern p-4 bg-white">
            <div className="d-flex align-items-center gap-3">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="rounded-circle border"
                  style={{ width: 64, height: 64, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #0b5ed7, #20c997)',
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  {initials}
                </div>
              )}
              <div className="flex-grow-1">
                <div className="fw-bold">{profile?.displayName || 'Your Profile'}</div>
                <div className="small text-muted">{user?.email}</div>
              </div>
            </div>

            <hr />

            <div className="row g-2 small">
              <div className="col-6">
                <div className="text-muted">Total reports</div>
                <div className="fw-semibold">{stats.total}</div>
              </div>
              <div className="col-6">
                <div className="text-muted">Last report</div>
                <div className="fw-semibold">{formatDate(stats.lastReportDate)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card-modern p-4 bg-white">
            <h2 className="h5 fw-bold mb-2">
              <i className="bi bi-gear me-2 text-primary"></i>
              Profile Settings
            </h2>
            <div className="text-muted small mb-3">
              Update your display name and profile image.
            </div>

            {!profile ? (
              <div>
                <SkeletonLine width="70%" height={14} className="mb-2" />
                <SkeletonLine width="100%" className="mb-2" />
                <SkeletonLine width="80%" />
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <div className="row g-2">
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Name</label>
                    <input
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small">Profile picture URL</label>
                    <input
                      className="form-control"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="col-12 d-flex gap-2 mt-2">
                    <button className="btn btn-primary btn-glow" disabled={saving}>
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Save changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setName(profile.displayName || '');
                        setPhotoUrl(profile.photoUrl || '');
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


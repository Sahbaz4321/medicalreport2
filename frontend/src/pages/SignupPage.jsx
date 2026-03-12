import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Calendar, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const fileInputRef = useRef(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Build DOB as YYYY-MM-DD if all parts selected
    let dobValue = '';
    if (dobYear && dobMonth && dobDay) {
      const m = dobMonth.toString().padStart(2, '0');
      const d = dobDay.toString().padStart(2, '0');
      dobValue = `${dobYear}-${m}-${d}`;
    }
    setDob(dobValue);

    setLoading(true);
    try {
      await signup(email, password, {
        fullName,
        displayName: fullName,
        phone,
        gender,
        dob: dobValue,
        location,
        photoUrl,
        useAvatar: !photoUrl,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center px-3"
      style={{
        minHeight: '100vh',
        paddingTop: '4.5rem',
        paddingBottom: '3rem',
        background:
          'linear-gradient(135deg, #eff6ff 0%, #ffffff 40%, #e0f2fe 100%)',
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-4 p-md-5"
        style={{ maxWidth: 480, width: '100%' }}
      >
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{
              width: 64,
              height: 64,
              background: '#2563eb',
              boxShadow: '0 18px 35px rgba(37, 99, 235, 0.35)',
            }}
          >
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="fw-bold mb-1" style={{ color: '#111827' }}>
            Create Account
          </h1>
          <p className="text-muted mb-0">
            Join us today and securely track your medical reports.
          </p>
        </div>

        {error && (
          <div className="bg-danger bg-opacity-10 border border-danger border-opacity-25 text-danger rounded-3 px-3 py-2 mb-4 small">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative mb-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center border border-4"
                style={{
                  width: 96,
                  height: 96,
                  borderColor: '#dbeafe',
                  backgroundColor: '#eff6ff',
                }}
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
                style={{ cursor: 'pointer', width: 96, height: 96, borderColor: '#dbeafe', backgroundColor: '#eff6ff' }}
              >
                {!photoUrl ? (
                  <User size={40} style={{ color: '#9ca3af' }} />
                ) : (
                  <img
                    src={photoUrl}
                    alt="Preview"
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center position-absolute"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: '#2563eb',
                  right: 0,
                  bottom: 0,
                  boxShadow: '0 8px 18px rgba(37,99,235,0.5)',
                }}
              >
                <ImageIcon size={16} className="text-white" />
              </div>
            </div>
            <div className="small text-muted">Tap to upload your photo</div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
            />
          </div>

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-medium text-muted">Full Name</label>
              <div className="position-relative">
                <User
                  size={18}
                  className="position-absolute"
                  style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-control ps-5 py-2 border rounded-3"
                  placeholder="John Doe"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="col-12">
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
                  placeholder="you@example.com"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-medium text-muted">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="form-select py-2 border rounded-3"
                style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label small fw-medium text-muted">Mobile Number</label>
              <div className="position-relative">
                <Phone
                  size={18}
                  className="position-absolute"
                  style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control ps-5 py-2 border rounded-3"
                  placeholder="+91 98765 43210"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-medium text-muted">Date of Birth</label>
              <div className="d-flex gap-2">
                <div className="position-relative flex-grow-1">
                  <Calendar
                    size={18}
                    className="position-absolute"
                    style={{
                      left: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                    }}
                  />
                  <select
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    className="form-select ps-5 py-2 border rounded-3"
                    style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <select
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  className="form-select py-2 border rounded-3"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none', maxWidth: 130 }}
                >
                  <option value="">Month</option>
                  <option value="1">Jan</option>
                  <option value="2">Feb</option>
                  <option value="3">Mar</option>
                  <option value="4">Apr</option>
                  <option value="5">May</option>
                  <option value="6">Jun</option>
                  <option value="7">Jul</option>
                  <option value="8">Aug</option>
                  <option value="9">Sep</option>
                  <option value="10">Oct</option>
                  <option value="11">Nov</option>
                  <option value="12">Dec</option>
                </select>
                <select
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  className="form-select py-2 border rounded-3"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none', maxWidth: 110 }}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-medium text-muted">Location (State)</label>
              <div className="position-relative">
                <MapPin
                  size={18}
                  className="position-absolute"
                  style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-select ps-5 py-2 border rounded-3"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                >
                  <option value="">Select your state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-12">
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control ps-5 py-2 border rounded-3"
                  placeholder="Create a password"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                />
              </div>
            </div>

            <div className="col-12">
              <label className="form-label small fw-medium text-muted">Confirm Password</label>
              <div className="position-relative">
                <Lock
                  size={18}
                  className="position-absolute"
                  style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control ps-5 py-2 border rounded-3"
                  placeholder="Confirm your password"
                  style={{ borderColor: '#e5e7eb', boxShadow: 'none' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-100 text-white fw-semibold py-2 rounded-3 mt-3"
            disabled={loading}
            style={{
              backgroundColor: '#2563eb',
              boxShadow: '0 14px 30px rgba(37,99,235,0.35)',
              border: 'none',
            }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0 small text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="fw-semibold text-decoration-none"
            style={{ color: '#2563eb' }}
          >
            Log in
          </Link>
        </p>

        <div className="text-center mt-2">
          <Link to="/" className="small text-muted text-decoration-none">
            <i className="bi bi-arrow-left me-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;


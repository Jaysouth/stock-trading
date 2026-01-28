import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    contact_number: '',
    password: '',
    password_confirm: '',
    two_factor_enabled: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await authService.register(formData);
      setSuccess('Registration successful! Please login.');
      
      if (response.data.qr_code) {
        setQrCode(response.data.qr_code);
        setSecret(response.data.secret);
      } else {
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <h2 className="card-header">Register</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="full_name"
              className="form-control"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number *</label>
            <input
              type="tel"
              name="contact_number"
              className="form-control"
              value={formData.contact_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password *</label>
            <input
              type="password"
              name="password_confirm"
              className="form-control"
              value={formData.password_confirm}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                name="two_factor_enabled"
                checked={formData.two_factor_enabled}
                onChange={handleChange}
              />
              <span>Enable Two-Factor Authentication (2FA)</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Register
          </button>
        </form>

        {qrCode && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3>2FA Setup</h3>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={qrCode} alt="2FA QR Code" style={{ maxWidth: '200px' }} />
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              Secret: <code>{secret}</code>
            </p>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary"
              style={{ marginTop: '10px' }}
            >
              Continue to Login
            </button>
          </div>
        )}

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;

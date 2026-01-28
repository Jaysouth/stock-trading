import React, { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    two_factor_token: '',
  });
  const [error, setError] = useState('');
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login(formData);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.two_factor_token?.[0] || 
                       err.response?.data?.message || 
                       'Login failed. Please try again.';
      
      if (errorMsg.includes('2FA token required')) {
        setNeedsTwoFactor(true);
        setError('Please enter your 2FA token');
      } else {
        setError(errorMsg);
      }
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '450px', margin: '80px auto' }}>
        <h2 className="card-header">Login</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
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
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {needsTwoFactor && (
            <div className="form-group">
              <label className="form-label">2FA Token</label>
              <input
                type="text"
                name="two_factor_token"
                className="form-control"
                value={formData.two_factor_token}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                maxLength="6"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

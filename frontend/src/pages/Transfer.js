import React, { useState } from 'react';
import { transactionService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Transfer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    from_wallet_type: 'savings',
    to_wallet_type: 'trading',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await transactionService.transfer({
        amount: parseFloat(formData.amount),
        from_wallet_type: formData.from_wallet_type,
        to_wallet_type: formData.to_wallet_type,
      });
      setSuccess('Transfer request submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
    }
  };

  const handleDirectionChange = () => {
    setFormData({
      ...formData,
      from_wallet_type: formData.to_wallet_type,
      to_wallet_type: formData.from_wallet_type,
    });
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '40px auto' }}>
        <h2 className="card-header">Transfer Between Wallets</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="alert" style={{ background: '#e7f3ff', border: '1px solid #b3d9ff', color: '#004085' }}>
          <strong>Note:</strong> Transfers between your wallets are free of charge but require admin approval.
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Amount to Transfer ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="form-control"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">From Wallet</label>
            <select
              className="form-control"
              value={formData.from_wallet_type}
              onChange={(e) => setFormData({ ...formData, from_wallet_type: e.target.value })}
              disabled
            >
              <option value="savings">Savings Wallet</option>
              <option value="trading">Trading Wallet</option>
            </select>
          </div>

          <div style={{ textAlign: 'center', margin: '10px 0' }}>
            <button
              type="button"
              onClick={handleDirectionChange}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              ⇅ Swap Direction
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">To Wallet</label>
            <select
              className="form-control"
              value={formData.to_wallet_type}
              onChange={(e) => setFormData({ ...formData, to_wallet_type: e.target.value })}
              disabled
            >
              <option value="savings">Savings Wallet</option>
              <option value="trading">Trading Wallet</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Submit Transfer Request
          </button>
          
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
            * Transfer requests require admin approval
          </p>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default Transfer;

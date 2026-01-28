import React, { useState, useEffect } from 'react';
import { bankAccountService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function BankAccounts() {
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    account_name: '',
    account_number: '',
    bank_name: '',
    routing_number: '',
    swift_code: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      const response = await bankAccountService.list();
      setBankAccounts(response.data);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (bankAccounts.length >= 2) {
      setError('You can only have 2 bank accounts registered');
      return;
    }

    try {
      await bankAccountService.create(formData);
      setSuccess('Bank account added successfully! Awaiting admin approval.');
      setFormData({
        account_name: '',
        account_number: '',
        bank_name: '',
        routing_number: '',
        swift_code: '',
      });
      setShowAddForm(false);
      loadBankAccounts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bank account.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bank account?')) {
      return;
    }

    try {
      await bankAccountService.delete(id);
      setSuccess('Bank account deleted successfully');
      loadBankAccounts();
    } catch (err) {
      setError('Failed to delete bank account');
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '24px' }}>Bank Accounts</h2>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Bank Accounts List */}
      <div className="card">
        <div className="card-header">
          Registered Bank Accounts ({bankAccounts.length}/2)
          {bankAccounts.length < 2 && !showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
              style={{ float: 'right', padding: '6px 12px' }}
            >
              + Add Bank Account
            </button>
          )}
        </div>

        {bankAccounts.length === 0 ? (
          <p style={{ color: '#999', marginTop: '10px' }}>No bank accounts registered yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Account Name</th>
                <th>Bank Name</th>
                <th>Account Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bankAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.account_name}</td>
                  <td>{account.bank_name}</td>
                  <td>{account.account_number}</td>
                  <td>
                    <span className={`status-badge status-${account.status}`}>
                      {account.status_display}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="btn btn-danger"
                      style={{ padding: '4px 8px', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Bank Account Form */}
      {showAddForm && (
        <div className="card">
          <div className="card-header">Add New Bank Account</div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Account Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.account_name}
                onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bank Name *</label>
              <input
                type="text"
                className="form-control"
                value={formData.bank_name}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                required
                placeholder="Chase Bank"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Number *</label>
              <input
                type="text"
                className="form-control"
                value={formData.account_number}
                onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                required
                placeholder="1234567890"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Routing Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.routing_number}
                onChange={(e) => setFormData({ ...formData, routing_number: e.target.value })}
                placeholder="021000021"
              />
            </div>

            <div className="form-group">
              <label className="form-label">SWIFT Code</label>
              <input
                type="text"
                className="form-control"
                value={formData.swift_code}
                onChange={(e) => setFormData({ ...formData, swift_code: e.target.value })}
                placeholder="CHASUS33"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                Add Bank Account
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>

            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              * Bank accounts require admin approval before use
            </p>
          </form>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <a href="/dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default BankAccounts;

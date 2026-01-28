import React, { useState, useEffect } from 'react';
import { bankAccountService, transactionService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Withdraw() {
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    bank_account_id: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [feeCalculation, setFeeCalculation] = useState(null);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      const response = await bankAccountService.list();
      const approved = response.data.filter(acc => acc.status === 'approved');
      setBankAccounts(approved);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    }
  };

  const calculateFees = (amount) => {
    const withdrawalFee = amount * 0.035; // 3.5%
    const vatFee = amount * 0.075; // 7.5%
    const totalFees = withdrawalFee + vatFee;
    const netAmount = amount - totalFees;
    
    return {
      amount: parseFloat(amount).toFixed(2),
      withdrawalFee: withdrawalFee.toFixed(2),
      vatFee: vatFee.toFixed(2),
      totalFees: totalFees.toFixed(2),
      netAmount: netAmount.toFixed(2),
    };
  };

  const handleAmountChange = (e) => {
    const amount = parseFloat(e.target.value) || 0;
    setFormData({ ...formData, amount: e.target.value });
    
    if (amount > 0) {
      setFeeCalculation(calculateFees(amount));
    } else {
      setFeeCalculation(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (bankAccounts.length === 0) {
      setError('You need an approved bank account to withdraw');
      return;
    }

    try {
      await transactionService.withdraw({
        amount: parseFloat(formData.amount),
        bank_account_id: parseInt(formData.bank_account_id),
      });
      setSuccess('Withdrawal request submitted successfully! Awaiting admin approval.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Withdrawal failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '40px auto' }}>
        <h2 className="card-header">Withdraw Funds</h2>
        
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        {bankAccounts.length === 0 ? (
          <div className="alert alert-warning">
            You need to add and get approval for a bank account before withdrawing.
            <a href="/bank-accounts/add" style={{ marginLeft: '10px' }}>Add Bank Account</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Amount to Withdraw ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-control"
                value={formData.amount}
                onChange={handleAmountChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bank Account</label>
              <select
                className="form-control"
                value={formData.bank_account_id}
                onChange={(e) => setFormData({ ...formData, bank_account_id: e.target.value })}
                required
              >
                <option value="">Select Bank Account</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.account_name} - {account.bank_name} ({account.account_number})
                  </option>
                ))}
              </select>
            </div>

            {feeCalculation && (
              <div className="card" style={{ background: '#f8f9fa', padding: '16px', marginBottom: '16px' }}>
                <h4 style={{ marginTop: 0 }}>Fee Breakdown</h4>
                <table style={{ width: '100%', fontSize: '14px' }}>
                  <tbody>
                    <tr>
                      <td>Withdrawal Amount:</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>${feeCalculation.amount}</td>
                    </tr>
                    <tr>
                      <td>Withdrawal Fee (3.5%):</td>
                      <td style={{ textAlign: 'right', color: '#dc3545' }}>-${feeCalculation.withdrawalFee}</td>
                    </tr>
                    <tr>
                      <td>VAT Fee (7.5%):</td>
                      <td style={{ textAlign: 'right', color: '#dc3545' }}>-${feeCalculation.vatFee}</td>
                    </tr>
                    <tr style={{ borderTop: '2px solid #ddd' }}>
                      <td><strong>Total Fees (11%):</strong></td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#dc3545' }}>-${feeCalculation.totalFees}</td>
                    </tr>
                    <tr style={{ borderTop: '2px solid #ddd', fontSize: '16px' }}>
                      <td><strong>You will receive:</strong></td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>${feeCalculation.netAmount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
              Submit Withdrawal Request
            </button>
            
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', textAlign: 'center' }}>
              * Withdrawal requests require admin approval
            </p>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/dashboard" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;

import React, { useState, useEffect } from 'react';
import { transactionService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Transactions() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getMyStatement();
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'approved':
        return '#17a2b8';
      case 'pending':
        return '#ffc107';
      case 'rejected':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return <div className="container"><p>Loading transactions...</p></div>;
  }

  return (
    <div className="container">
      <h2 style={{ marginBottom: '24px' }}>Transaction History</h2>

      <div className="card">
        <div className="card-header">All Transactions</div>
        
        {transactions.length === 0 ? (
          <p style={{ color: '#999', marginTop: '10px' }}>No transactions yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Fees</th>
                  <th>Net Amount</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                    <td>
                      <span style={{ fontWeight: '500' }}>
                        {transaction.transaction_type_display}
                      </span>
                    </td>
                    <td>${parseFloat(transaction.amount).toFixed(2)}</td>
                    <td style={{ color: transaction.total_fees > 0 ? '#dc3545' : '#6c757d' }}>
                      ${parseFloat(transaction.total_fees).toFixed(2)}
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      ${parseFloat(transaction.net_amount).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${transaction.status}`}
                        style={{ backgroundColor: getStatusColor(transaction.status) + '20' }}
                      >
                        {transaction.status_display}
                      </span>
                    </td>
                    <td>
                      {transaction.transaction_type === 'withdrawal' && transaction.to_bank_account_details && (
                        <small style={{ fontSize: '11px' }}>
                          To: {transaction.to_bank_account_details.bank_name}
                        </small>
                      )}
                      {transaction.transaction_type === 'transfer' && (
                        <small style={{ fontSize: '11px' }}>
                          {transaction.from_wallet_details?.wallet_type_display} → {transaction.to_wallet_details?.wallet_type_display}
                        </small>
                      )}
                      {transaction.rejection_reason && (
                        <div style={{ color: '#dc3545', fontSize: '11px', marginTop: '4px' }}>
                          Reason: {transaction.rejection_reason}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Fee Breakdown Summary */}
      {transactions.some(t => t.total_fees > 0) && (
        <div className="card">
          <div className="card-header">Fee Summary</div>
          <table className="table">
            <thead>
              <tr>
                <th>Transaction Type</th>
                <th>Total Fees Paid</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => t.total_fees > 0)
                .reduce((acc, t) => {
                  const existing = acc.find(x => x.type === t.transaction_type);
                  if (existing) {
                    existing.fees += parseFloat(t.total_fees);
                  } else {
                    acc.push({
                      type: t.transaction_type,
                      display: t.transaction_type_display,
                      fees: parseFloat(t.total_fees)
                    });
                  }
                  return acc;
                }, [])
                .map((summary, idx) => (
                  <tr key={idx}>
                    <td>{summary.display}</td>
                    <td style={{ color: '#dc3545', fontWeight: 'bold' }}>
                      ${summary.fees.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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

export default Transactions;

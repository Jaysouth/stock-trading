import React, { useState, useEffect } from 'react';
import { walletService, bankAccountService, transactionService, authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState({ savings_wallet: null, trading_wallet: null });
  const [bankAccounts, setBankAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      const [walletsRes, bankAccountsRes, transactionsRes] = await Promise.all([
        walletService.getMyWallets(),
        bankAccountService.list(),
        transactionService.getMyStatement(),
      ]);
      
      setWallets(walletsRes.data);
      setBankAccounts(bankAccountsRes.data);
      setTransactions(transactionsRes.data.slice(0, 5)); // Latest 5 transactions
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <a href="/dashboard" className="navbar-brand">Stock Trading</a>
          <div className="navbar-nav">
            <span className="nav-link">Welcome, {user?.full_name}</span>
            <a href="/transactions" className="nav-link">Transactions</a>
            <a href="/bank-accounts" className="nav-link">Bank Accounts</a>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>

        {/* Wallet Widgets */}
        <div className="grid">
          <div className="wallet-widget" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="wallet-label">Savings Wallet</div>
            <div className="wallet-balance">${wallets.savings_wallet?.balance || '0.00'}</div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Available for withdrawal and transfers</p>
          </div>

          <div className="wallet-widget" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="wallet-label">Trading Wallet</div>
            <div className="wallet-balance">${wallets.trading_wallet?.balance || '0.00'}</div>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>Available for forex trading</p>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="card">
          <div className="card-header">
            Bank Accounts
            <a href="/bank-accounts/add" style={{ float: 'right', fontSize: '14px' }}>
              + Add Account
            </a>
          </div>
          {bankAccounts.length === 0 ? (
            <p style={{ color: '#999' }}>No bank accounts registered yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Bank</th>
                  <th>Account Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bankAccounts.slice(0, 2).map((account) => (
                  <tr key={account.id}>
                    <td>{account.account_name}</td>
                    <td>{account.bank_name}</td>
                    <td>{account.account_number}</td>
                    <td>
                      <span className={`status-badge status-${account.status}`}>
                        {account.status_display}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {bankAccounts.length < 2 && (
            <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
              You can register up to 2 bank accounts.
            </p>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            Recent Transactions
            <a href="/transactions" style={{ float: 'right', fontSize: '14px' }}>
              View All
            </a>
          </div>
          {transactions.length === 0 ? (
            <p style={{ color: '#999' }}>No transactions yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.transaction_type_display}</td>
                    <td>${transaction.amount}</td>
                    <td>
                      <span className={`status-badge status-${transaction.status}`}>
                        {transaction.status_display}
                      </span>
                    </td>
                    <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">Quick Actions</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/transactions/deposit" className="btn btn-primary">Deposit Funds</a>
            <a href="/transactions/withdraw" className="btn btn-success">Withdraw Funds</a>
            <a href="/transactions/transfer" className="btn btn-secondary">Transfer to Trading</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

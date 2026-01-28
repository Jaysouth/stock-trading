import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BankAccounts from './pages/BankAccounts';
import Transactions from './pages/Transactions';
import Withdraw from './pages/Withdraw';
import Transfer from './pages/Transfer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bank-accounts" element={<BankAccounts />} />
        <Route path="/bank-accounts/add" element={<BankAccounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/transactions/withdraw" element={<Withdraw />} />
        <Route path="/transactions/transfer" element={<Transfer />} />
      </Routes>
    </Router>
  );
}

export default App;

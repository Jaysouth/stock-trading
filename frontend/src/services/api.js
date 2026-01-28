import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth Services
export const authService = {
  register: (userData) => apiClient.post('/users/register/', userData),
  login: (credentials) => apiClient.post('/users/login/', credentials),
  logout: () => apiClient.post('/users/logout/'),
  getMe: () => apiClient.get('/users/me/'),
  setup2FA: (enable) => apiClient.post('/users/setup_2fa/', { enable }),
  verify2FA: (token) => apiClient.post('/users/verify_2fa/', { token }),
};

// Wallet Services
export const walletService = {
  getMyWallets: () => apiClient.get('/wallets/my_wallets/'),
  getCompanyWallet: () => apiClient.get('/wallets/company_wallet/'),
};

// Bank Account Services
export const bankAccountService = {
  list: () => apiClient.get('/bank-accounts/'),
  create: (data) => apiClient.post('/bank-accounts/', data),
  update: (id, data) => apiClient.put(`/bank-accounts/${id}/`, data),
  delete: (id) => apiClient.delete(`/bank-accounts/${id}/`),
  approve: (id, action, reason) => apiClient.post(`/bank-accounts/${id}/approve/`, { action, rejection_reason: reason }),
};

// Transaction Services
export const transactionService = {
  list: () => apiClient.get('/transactions/'),
  deposit: (data) => apiClient.post('/transactions/deposit/', data),
  withdraw: (data) => apiClient.post('/transactions/withdraw/', data),
  transfer: (data) => apiClient.post('/transactions/transfer/', data),
  approve: (id, action, reason) => apiClient.post(`/transactions/${id}/approve/`, { action, rejection_reason: reason }),
  getMyStatement: () => apiClient.get('/transactions/my_statement/'),
  getAdminStatement: () => apiClient.get('/transactions/admin_statement/'),
};

export default apiClient;

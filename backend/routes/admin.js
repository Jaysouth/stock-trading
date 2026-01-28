const express = require('express');
const {
  getDashboard,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getPendingTransactions,
  approveTransaction,
  rejectTransaction,
  getAllTrades,
  getStatistics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', updateUserStatus);

// Transaction management
router.get('/transactions/pending', getPendingTransactions);
router.put('/transactions/:id/approve', approveTransaction);
router.put('/transactions/:id/reject', rejectTransaction);

// Trade monitoring
router.get('/trades', getAllTrades);

// Statistics
router.get('/statistics', getStatistics);

module.exports = router;

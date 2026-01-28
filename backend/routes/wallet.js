const express = require('express');
const {
  getWallet,
  deposit,
  withdraw,
  transfer,
  getTransactions,
  allocateCapital
} = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/', getWallet);
router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.post('/transfer', transfer);
router.post('/allocate', allocateCapital);
router.get('/transactions', getTransactions);

module.exports = router;

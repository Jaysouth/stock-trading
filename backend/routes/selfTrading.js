const express = require('express');
const {
  getTrades,
  createTrade,
  closeTrade,
  updateTrade,
  getPerformance
} = require('../controllers/selfTradingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/trades', getTrades);
router.post('/trades', createTrade);
router.put('/trades/:id', updateTrade);
router.put('/trades/:id/close', closeTrade);
router.get('/performance', getPerformance);

module.exports = router;

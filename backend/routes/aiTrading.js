const express = require('express');
const {
  getConfig,
  updateConfig,
  startTrading,
  stopTrading,
  pauseTrading,
  resumeTrading,
  getPerformance,
  getTrades
} = require('../controllers/aiTradingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes are protected

router.get('/config', getConfig);
router.put('/config', updateConfig);
router.post('/start', startTrading);
router.post('/stop', stopTrading);
router.post('/pause', pauseTrading);
router.post('/resume', resumeTrading);
router.get('/performance', getPerformance);
router.get('/trades', getTrades);

module.exports = router;

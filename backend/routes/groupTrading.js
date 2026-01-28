const express = require('express');
const {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  getMyGroups,
  getGroupMembers,
  getGroupTrades,
  updateCopySettings
} = require('../controllers/groupTradingController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/groups', getGroups);
router.get('/groups/:id', getGroup);

// Protected routes
router.use(protect);

router.post('/groups', createGroup);
router.post('/groups/:id/join', joinGroup);
router.post('/groups/:id/leave', leaveGroup);
router.get('/my-groups', getMyGroups);
router.get('/groups/:id/members', getGroupMembers);
router.get('/groups/:id/trades', getGroupTrades);
router.put('/groups/:id/copy-settings', updateCopySettings);

module.exports = router;

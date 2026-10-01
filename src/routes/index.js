const express = require('express');
const health = require('./health');
const notifications = require('./notifications');

const router = express.Router();

router.use('/health', health);
router.use('/notifications', notifications);

module.exports = router;

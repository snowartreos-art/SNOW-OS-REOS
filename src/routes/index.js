const express = require('express');
const health = require('./health');
const notifications = require('./notifications');
const portfoy = require('./portfoy');
const musteri = require('./musteri');
const kira = require('./kira');

const router = express.Router();

router.use('/health', health);
router.use('/notifications', notifications);
router.use('/portfoy', portfoy);
router.use('/musteri', musteri);
router.use('/kira', kira);

module.exports = router;

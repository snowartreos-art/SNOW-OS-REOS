const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  const slack = req.app.locals.slack;
  res.json({
    status: 'ok',
    version: 'v1',
    uptime: process.uptime(),
    slack: slack ? 'connected' : 'disabled',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/v1/notifications
// Body: { channel?, text, blocks? }  -> sends a message to Slack.
router.post('/', async (req, res) => {
  const slack = req.app.locals.slack;
  if (!slack) {
    return res.status(503).json({ error: 'Slack integration is not configured' });
  }

  const { channel, text, blocks } = req.body || {};
  if (!text && !blocks) {
    return res.status(400).json({ error: 'text or blocks is required' });
  }

  try {
    const result = await slack.notify({ channel, text, blocks });
    logger.info(`Notification sent to ${result.channel} (ts=${result.ts})`);
    res.status(201).json({ ok: true, channel: result.channel, ts: result.ts });
  } catch (err) {
    const detail = (err.data && err.data.error) || err.message;
    logger.error('Failed to send Slack notification:', detail);
    res.status(502).json({ error: 'Failed to send Slack notification', detail });
  }
});

module.exports = router;

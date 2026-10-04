const express = require('express');
const repo = require('../repositories/cagriRepo');
const { parseCallMessage } = require('../services/callParser');
const { handleCall } = require('../services/calls');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(repo.list());
});

router.get('/:id', (req, res) => {
  const record = repo.findById(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Cagri bulunamadi' });
  res.json(record);
});

// POST /api/v1/cagri  Body: { text }  -> processes a Bulutfon call message
// the same way the Slack listener does (useful for testing and replays).
router.post('/', async (req, res) => {
  const parsed = parseCallMessage((req.body || {}).text);
  if (!parsed) return res.status(400).json({ error: 'Bulutfon cagri mesaji taninamadi' });

  const record = await handleCall(parsed);
  if (!record) return res.status(200).json({ ok: true, duplicate: true });
  res.status(201).json(record);
});

module.exports = router;

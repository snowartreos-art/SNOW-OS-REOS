const express = require('express');
const repo = require('../repositories/musteriRepo');
const { notifyCreated } = require('../services/notifications');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(repo.list());
});

router.get('/:id', (req, res) => {
  const record = repo.findById(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Musteri bulunamadi' });
  res.json(record);
});

router.post('/', async (req, res) => {
  const { ad_soyad, telefon, email, tip } = req.body || {};
  if (!ad_soyad) return res.status(400).json({ error: 'ad_soyad zorunludur' });

  const record = repo.create({ ad_soyad, telefon, email, tip });
  await notifyCreated(req.app.locals.slack, 'musteri', record);
  res.status(201).json(record);
});

module.exports = router;

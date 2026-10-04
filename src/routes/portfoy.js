const express = require('express');
const repo = require('../repositories/portfoyRepo');
const { notifyCreated } = require('../services/notifications');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(repo.list());
});

router.get('/:id', (req, res) => {
  const record = repo.findById(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Portfoy bulunamadi' });
  res.json(record);
});

router.post('/', async (req, res) => {
  const { baslik, tip, fiyat, adres, durum } = req.body || {};
  if (!baslik) return res.status(400).json({ error: 'baslik zorunludur' });

  const record = repo.create({ baslik, tip, fiyat, adres, durum });
  await notifyCreated(req.app.locals.slack, 'portfoy', record);
  res.status(201).json(record);
});

module.exports = router;

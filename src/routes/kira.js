const express = require('express');
const repo = require('../repositories/kiraRepo');
const portfoyRepo = require('../repositories/portfoyRepo');
const musteriRepo = require('../repositories/musteriRepo');
const { notifyCreated } = require('../services/notifications');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(repo.list());
});

router.get('/:id', (req, res) => {
  const record = repo.findById(Number(req.params.id));
  if (!record) return res.status(404).json({ error: 'Kira kaydi bulunamadi' });
  res.json(record);
});

router.post('/', async (req, res) => {
  const { portfoy_id, musteri_id, aylik_tutar, baslangic_tarihi, bitis_tarihi, durum } =
    req.body || {};

  if (!portfoy_id || !musteri_id || aylik_tutar == null) {
    return res
      .status(400)
      .json({ error: 'portfoy_id, musteri_id ve aylik_tutar zorunludur' });
  }
  if (!portfoyRepo.findById(Number(portfoy_id))) {
    return res.status(400).json({ error: 'Gecersiz portfoy_id' });
  }
  if (!musteriRepo.findById(Number(musteri_id))) {
    return res.status(400).json({ error: 'Gecersiz musteri_id' });
  }

  const record = repo.create({
    portfoy_id,
    musteri_id,
    aylik_tutar,
    baslangic_tarihi,
    bitis_tarihi,
    durum,
  });
  await notifyCreated(req.app.locals.slack, 'kira', record);
  res.status(201).json(record);
});

module.exports = router;

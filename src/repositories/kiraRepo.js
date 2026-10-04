const { getDb } = require('../db');

module.exports = {
  create({ portfoy_id, musteri_id, aylik_tutar, baslangic_tarihi, bitis_tarihi, durum }) {
    const info = getDb()
      .prepare(
        `INSERT INTO kira
           (portfoy_id, musteri_id, aylik_tutar, baslangic_tarihi, bitis_tarihi, durum)
         VALUES
           (@portfoy_id, @musteri_id, @aylik_tutar, @baslangic_tarihi, @bitis_tarihi, @durum)`
      )
      .run({
        portfoy_id: Number(portfoy_id),
        musteri_id: Number(musteri_id),
        aylik_tutar: Number(aylik_tutar),
        baslangic_tarihi: baslangic_tarihi == null ? null : baslangic_tarihi,
        bitis_tarihi: bitis_tarihi == null ? null : bitis_tarihi,
        durum: durum || 'aktif',
      });
    return this.findById(info.lastInsertRowid);
  },
  findById(id) {
    return getDb().prepare('SELECT * FROM kira WHERE id = ?').get(id);
  },
  list() {
    return getDb().prepare('SELECT * FROM kira ORDER BY id DESC').all();
  },
};

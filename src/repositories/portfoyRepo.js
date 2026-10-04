const { getDb } = require('../db');

module.exports = {
  create({ baslik, tip, fiyat, adres, durum }) {
    const info = getDb()
      .prepare(
        `INSERT INTO portfoy (baslik, tip, fiyat, adres, durum)
         VALUES (@baslik, @tip, @fiyat, @adres, @durum)`
      )
      .run({
        baslik,
        tip: tip || 'satilik',
        fiyat: fiyat == null ? null : Number(fiyat),
        adres: adres == null ? null : adres,
        durum: durum || 'aktif',
      });
    return this.findById(info.lastInsertRowid);
  },
  findById(id) {
    return getDb().prepare('SELECT * FROM portfoy WHERE id = ?').get(id);
  },
  list() {
    return getDb().prepare('SELECT * FROM portfoy ORDER BY id DESC').all();
  },
};
